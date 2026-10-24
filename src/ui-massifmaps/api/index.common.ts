import { EventData, Observable } from '@nativescript/core';
import { bridge } from './bridge';
import type { Delivery as NativeDelivery } from './bridge';
import { classOfShortName, classOfSpec, enumName, enumValue, eventNames, findEvent, isKnownClass, isSubclassOf, propertyNames, resolveMethod, resolvePath, specKindOf } from './resolve';
import type {
    Bounds,
    ClassName,
    ClassOfSpec,
    EventName,
    Handle,
    Json,
    Kind,
    MethodArgs,
    MethodName,
    MethodResult,
    MethodResultClass,
    ClassAtPath,
    ObjectPath,
    PayloadClass,
    Position,
    PositionAt,
    PositionPath,
    Tile,
    ProjectionName,
    SpecArg,
    SpecType,
    ValueAt,
    WriteAt,
    ValuePath,
    WritablePath
} from './massif-api';

// `export type *`: massif-api is a .d.ts with no runtime module, and a plain `export *` is NOT elided
export type * from './massif-api';

/**
 * Typed layer over the SDK's string facade (create, destroy, set, get, call, on). Paths, spec keys,
 * methods and events are generated from the table the C++ resolves against. Lives beside the object API.
 */

/** Mirrors `massif::api::Result`; anything unlisted arrives as its number. */
export const Result = {
    OK: 0,
    BAD_HANDLE: 1,
    UNKNOWN_CLASS: 2,
    UNKNOWN_PROPERTY: 3,
    READONLY: 4,
    UNSUPPORTED_TYPE: 5,
    NULL_OBJECT: 8
} as const;

export class MassifApiError extends Error {
    constructor(
        message: string,
        readonly result?: number
    ) {
        super(message);
        this.name = 'MassifApiError';
    }
}

export function isAvailable(): boolean {
    return bridge.available;
}

/** False on an SDK whose `MassifApi.on` lacks the consume flag: `consumed` is then accepted and ignored. */
export function canConsume(): boolean {
    return bridge.canConsume;
}

function requireApi() {
    if (!bridge.available) {
        throw new MassifApiError('this MassifMaps build has no surface API - the SDK was built without all/native/api');
    }
}

/**
 * Handlers always run on the main thread: the SDK emits from threads with no JS runtime, so the native
 * listener hops to main and WAITS (so `consumed` returns in time and the payload is still alive).
 * The facade's DELIVERY_UI / DELIVERY_BACKGROUND cannot work from JS, so they are not exposed.
 */
const DELIVERY_ORIGIN: NativeDelivery = 0;

export interface SubscribeOptions {
    /** Default projection for position reads, e.g. `'EPSG:3857'`; only during the call, a kept payload falls back to WGS84. */
    projection?: ProjectionName;
    /**
     * Drop events within this many ms of the last one handled (`map.moved` fires 47-159/s in a drag).
     * Never on a consumable event: a dropped click is one the SDK is still waiting on.
     */
    throttle?: number;
    /**
     * Deliver only the LAST event of a burst, this many ms after it stops. The payload is freed on emit,
     * so the handler gets a frozen snapshot: `data.payload` is null, `data.get(path)` reads the snapshot.
     * Never on a consumable event.
     */
    debounce?: number;
}

/**
 * Per-payload-class event prototype with a lazy getter per property (`e.reason`), built once and
 * cached since `map.moved` arrives up to 159/s. Event own properties (`get`, `payload`...) shadow it.
 */
const payloadProtos: { [cls: string]: object } = {};

function payloadProto(payloadClass: string): object {
    let proto = payloadProtos[payloadClass];
    if (!proto) {
        proto = payloadProtos[payloadClass] = {};
        for (const name of propertyNames(payloadClass)) {
            Object.defineProperty(proto, name, {
                enumerable: true,
                configurable: true,
                get(this: MassifEventData) {
                    return (this as any).get(name);
                }
            });
        }
    }
    return proto;
}


type TopLevelPath<P> = P extends `${string}.${string}` ? never : P;

/** Payload properties readable off the event; names shadowing the event's own fields stay reachable via `get` only. */
export type PayloadFields<C extends ClassName, E extends EventName<C>> = Omit<
    { readonly [K in TopLevelPath<ValuePath<PayloadClass<C, E>>>]: ValueAt<PayloadClass<C, E>, K> },
    'eventName' | 'object' | 'payload' | 'consumed' | 'consumable' | 'get' | 'getPos'
>;

export type MassifEventData<C extends ClassName = any, E extends EventName<C> = EventName<C>> = EventData &
    PayloadFields<C, E> & {
        eventName: string;
        object: MassifObject<C>;
        /** Valid ONLY while the handler runs (freed on the way out). Null for `map.idle`. */
        payload: MassifObject<PayloadClass<C, E>> | null;
        /**
         * Set true to hide the event from later subscribers and the map. Only consumable events
         * (`vectortile.clicked`, `vectorelement.clicked`, `celestial.clicked`, `sky.clicked`); elsewhere ignored, warned once.
         */
        consumed: boolean;
        readonly consumable: boolean;
        /** Shorthand for `payload.get(path)`. Throws when the event carries no payload. */
        get<P extends ValuePath<PayloadClass<C, E>>>(path: P): ValueAt<PayloadClass<C, E>, P>;
        getPos<P extends PositionPath<PayloadClass<C, E>>>(path: P, projection?: ProjectionName): PositionAt<PayloadClass<C, E>, P> | null;
        getPos(path: string & {}, projection?: ProjectionName): Position | Bounds | null;
    };

/** `remove()` is idempotent: removing twice is an SDK error. */
export class Subscription {
    private mRemoved = false;
    /** Cancels a debounced delivery that has not fired yet, so `remove()` really means removed. */
    private mCancelPending: (() => void) | null = null;

    constructor(readonly id: number) {}

    get valid() {
        return !this.mRemoved;
    }

    remove(): boolean {
        if (this.mRemoved) {
            return false;
        }
        this.mRemoved = true;
        if (this.mCancelPending) {
            this.mCancelPending();
            this.mCancelPending = null;
        }
        return bridge.off(this.id);
    }

    /** @internal */
    onRemove(cancel: () => void) {
        this.mCancelPending = cancel;
    }
}

/**
 * Cancelling cannot abort a call already running (SDK load paths take no cancellation token): it
 * finishes and the result is dropped. Either way the promise rejects.
 */
export interface CancellablePromise<T> extends Promise<T> {
    cancel(): boolean;
}

function parseJson(text: string | null): Json {
    if (text === null || text === '') {
        return null;
    }
    try {
        return JSON.parse(text);
    } catch (e) {
        // A plain string property that is not valid JSON is its own value.
        return text;
    }
}

type SpecObject = { type: string } & { [key: string]: unknown };

function isSpec(value: unknown): value is SpecObject {
    return (
        !!value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        !(value instanceof MassifObject) &&
        typeof (value as { handle?: unknown }).handle !== 'number' &&
        typeof (value as { type?: unknown }).type === 'string'
    );
}

function handleOf(value: unknown): number {
    if (typeof value === 'number') {
        return value;
    }
    if (value && typeof (value as MassifObject).handle === 'number') {
        return (value as MassifObject).handle;
    }
    return 0;
}

/** The view API's object position; its key names are app-configurable (setMapPosKeys), never hard-code them. */
export interface LatLon {
    // `| undefined`: altitude is optional in app position types, which a plain `number` index refuses
    [key: string]: number | undefined;
}

export type AnyPosition = Position | LatLon;

/**
 * To the facade's `[lng, lat]`, never a MapPos (massif-maps/MassifMaps#159). Deliberately ignores the
 * setMapPosKeys keys: a facade position must not change meaning with the view API's config.
 */
function toPosition(position: AnyPosition): Position {
    if (Array.isArray(position)) {
        return position;
    }
    // `lon` too: the SDK's own MapPos spelling
    const lng = position.longitude ?? position.lng ?? position.lon;
    const lat = position.latitude ?? position.lat;
    const altitude = position.altitude ?? position.alt;
    if (lng === undefined || lat === undefined) {
        throw new MassifApiError(`not a position: ${JSON.stringify(position)}`);
    }
    return altitude ? [lng, lat, altitude] : [lng, lat];
}

function argsJson(args: readonly unknown[]): string {
    return JSON.stringify(args.map((a) => (a instanceof MassifObject ? a.handle : a)));
}

/** Path-prefix scope, e.g. `map.group('fogOptions').set('rangeStart', 2.5)`, instead of 700+ named accessors. */
export class PropertyGroup<C extends ClassName = any> {
    constructor(
        // `any`: pinning the owner's class parameter makes every nested group() unassignable
        private readonly owner: MassifObject<any>,
        private readonly prefix: string,
        readonly className: C
    ) {}

    path(path: string) {
        return this.prefix ? `${this.prefix}.${path}` : path;
    }

    get<P extends ValuePath<C>>(path: P): ValueAt<C, P> {
        return this.owner.get(this.path(path) as never) as ValueAt<C, P>;
    }

    set<P extends WritablePath<C>>(path: P, value: WriteAt<C, P>): this {
        this.owner.set(this.path(path) as never, value as never);
        return this;
    }

    apply(values: Partial<{ [P in WritablePath<C>]: WriteAt<C, P> }>): this {
        const prefixed: { [path: string]: unknown } = {};
        for (const key of Object.keys(values)) {
            prefixed[this.path(key)] = (values as never)[key];
        }
        this.owner.apply(prefixed as never);
        return this;
    }

    getPos(path: string, projection?: ProjectionName) {
        return this.owner.getPos(this.path(path), projection);
    }

    group<P extends ObjectPath<C>>(path: P): PropertyGroup<ClassAtPath<C, P>> {
        return this.owner.group(this.path(path) as never) as never;
    }

    /** @see MassifObject.child */
    child<P extends ObjectPath<C>>(path: P): MassifObject<ClassAtPath<C, P>> | null {
        return this.owner.child(this.path(path) as never) as never;
    }
}

/** The table types an object result as `Handle`; here it arrives wrapped, for the caller to read and destroy. */
export type CallResult<C extends ClassName, M extends MethodName<C>> = [MethodResultClass<C, M>] extends [never] ? MethodResult<C, M> : MassifObject<MethodResultClass<C, M>>;

export type ResultClass<C extends ClassName, M extends MethodName<C>> = [MethodResultClass<C, M>] extends [never] ? any : MethodResultClass<C, M>;

/** A native subscription is taken on an event's first handler and dropped with its last. */
export class MassifObject<C extends ClassName = any> extends Observable {
    private mSubscriptions: { [event: string]: Subscription } = {};
    private mDefaults: SubscribeOptions = {};
    private mDestroyed = false;

    constructor(
        readonly handle: Handle<C>,
        readonly className: C,
        /** The registry id, when the object has one. A call result does not. */
        readonly id?: string
    ) {
        super();
    }

    /** `instanceof` by class name, e.g. `layer.is('massif::RasterTileLayer')`. */
    is(className: ClassName): boolean {
        return isSubclassOf(this.className as string, className as string);
    }

    /** False after `destroy`, and after the id was dropped. */
    get valid() {
        return !this.mDestroyed && bridge.isValid(this.handle);
    }

    /**
     * The path may walk objects (`fogOptions.rangeStart`), structs (`clickInfo.clickType`) and free-form
     * data (`properties.name`). Enums come back as names, positions as `[lon, lat]`, structs as JSON.
     */
    get<P extends ValuePath<C>>(path: P): ValueAt<C, P> {
        return this.read(path as string) as ValueAt<C, P>;
    }

    private read(path: string): unknown {
        const info = resolvePath(this.className, path);
        switch (info?.code) {
            case 'b':
                return bridge.getBool(this.handle, path, false);
            case 'i':
            case 'c':
                return bridge.getInt(this.handle, path, 0);
            case 'f':
                return bridge.getFloat(this.handle, path, 0);
            case 's':
                return bridge.getString(this.handle, path);
            case 'e':
                return enumName(info.arg, bridge.getInt(this.handle, path, 0));
            case 'p':
                return parseJson(bridge.getPos(this.handle, path, ''));
            case 't':
                return parseJson(bridge.getString(this.handle, path));
            case 'o':
                throw new MassifApiError(`${path} is an object property - reach it with group('${path}'), child('${path}') or read a path through it`);
            default:
                // Unknown to the tables (a Variant path, or a more derived concrete class): the C++
                // resolves it, so read it as text
                return parseJson(bridge.getString(this.handle, path));
        }
    }

    /** An enum takes its constant name, a position an array. */
    set<P extends WritablePath<C>>(path: P, value: WriteAt<C, P>): this {
        const result = this.write(path as string, value);
        if (result !== Result.OK) {
            throw new MassifApiError(`${this.className}.${path}: ${resultName(result)}`, result);
        }
        return this;
    }

    /** The same without throwing, for a path that may legitimately not be there. */
    trySet<P extends WritablePath<C>>(path: P, value: WriteAt<C, P>): number {
        return this.write(path as string, value);
    }

    private write(path: string, value: unknown): number {
        const info = resolvePath(this.className, path);
        switch (info?.code) {
            case 'b':
                return bridge.setBool(this.handle, path, !!value);
            case 'i':
            case 'c':
                return bridge.setInt(this.handle, path, value as number);
            case 'f':
                return bridge.setFloat(this.handle, path, value as number);
            case 's':
                return bridge.setString(this.handle, path, String(value));
            case 'e':
                return bridge.setInt(this.handle, path, enumValue(String(value)) ?? Number(value));
            case 'o':
                return isSpec(value)
                    ? this.writeSpec(path, info.arg as string, value)
                    : bridge.setObject(this.handle, path, handleOf(value));
            case 'p':
            case 't':
            case 'v':
                return bridge.setString(this.handle, path, JSON.stringify(value));
            default:
                return this.writeByType(path, value);
        }
    }

    /**
     * Plain `setObject` would collapse a spec to NULL_HANDLE, which CLEARS the property and returns OK.
     * The built object gets an id derived from the target, so it lives with the property and a rewrite replaces it.
     */
    private writeSpec(path: string, objectClass: string, spec: SpecObject): number {
        const kind = specKindOf(objectClass);
        if (!kind) {
            return Result.UNKNOWN_CLASS;
        }
        const id = `${this.id ?? this.handle}.${path}`;
        // A different spec under a live id is refused, so the previous one goes first.
        find(kind, id, objectClass as ClassName)?.destroy();
        const built = create(kind, id, spec as never, objectClass as ClassName);
        return bridge.setObject(this.handle, path, built.handle);
    }

    private writeByType(path: string, value: unknown): number {
        if (typeof value === 'boolean') {
            return bridge.setBool(this.handle, path, value);
        }
        if (typeof value === 'number') {
            return bridge.setFloat(this.handle, path, value);
        }
        if (typeof value === 'string') {
            // An enum constant read as text would parse as 0, which is a real value.
            const asEnum = enumValue(value);
            return asEnum === undefined ? bridge.setString(this.handle, path, value) : bridge.setInt(this.handle, path, asEnum);
        }
        if (value instanceof MassifObject) {
            return bridge.setObject(this.handle, path, value.handle);
        }
        return bridge.setString(this.handle, path, JSON.stringify(value));
    }

    /**
     * Several properties in ONE JNI/JSI crossing via `setAll`. Object values (handles, inline specs) cannot
     * be JSON and go one by one, as does everything on an SDK without `setAll`.
     */
    apply(values: Partial<{ [P in WritablePath<C>]: WriteAt<C, P> }>): this {
        const setAll = bridge.setAll;
        const batched: { [path: string]: unknown } = {};
        const single: string[] = [];
        for (const key of Object.keys(values)) {
            const value: unknown = (values as never)[key];
            if (!setAll || value instanceof MassifObject || isSpec(value) || resolvePath(this.className, key)?.code === 'o') {
                single.push(key);
            } else {
                batched[key] = value;
            }
        }
        if (setAll && Object.keys(batched).length) {
            const result = setAll(this.handle, JSON.stringify(batched), '');
            // replay per key on failure so the error names the key, not the object
            if (result !== Result.OK) {
                single.unshift(...Object.keys(batched));
            }
        }
        for (const key of single) {
            this.set(key as WritablePath<C>, (values as never)[key]);
        }
        return this;
    }

    /**
     * WGS84 `[lng, lat]` unless a projection is named here or on the subscription. An object whose source
     * projection is unknown is left unconverted: a wrong guess is worse than an unconverted number.
     */
    getPos<P extends PositionPath<C>>(path: P, projection?: ProjectionName): PositionAt<C, P> | null;
    /** A path the tables do not carry - the concrete class is more derived than the declared one. */
    getPos(path: string & {}, projection?: ProjectionName): Position | Bounds | null;
    getPos(path: string, projection?: ProjectionName): Position | Bounds | null {
        const json = bridge.getPos(this.handle, path, projection ?? '');
        if (!json) {
            return null;
        }
        // Before its first layout a map view answers `[0, null]`, which JSON.parse throws on.
        try {
            return JSON.parse(json) as Position | Bounds;
        } catch {
            return null;
        }
    }

    group<P extends ObjectPath<C>>(path: P): PropertyGroup<ClassAtPath<C, P>> {
        const info = resolvePath(this.className, path as string);
        if (!info || info.code !== 'o') {
            throw new MassifApiError(`${this.className}.${path} is not an object property`);
        }
        return new PropertyGroup(this, path as string, info.arg as ClassName) as never;
    }

    /**
     * The object behind an object property, OWNED by the caller (`destroy()` it); null when empty.
     * Unlike `group` it hands the object over, e.g. to share a source between layers.
     */
    child<P extends ObjectPath<C>>(path: P): MassifObject<ClassAtPath<C, P>> | null {
        const info = resolvePath(this.className, path as string);
        if (!info || info.code !== 'o') {
            throw new MassifApiError(`${this.className}.${path} is not an object property`);
        }
        const handle = bridge.getObject(this.handle, path as string);
        return handle ? (new MassifObject(handle as Handle, info.arg as ClassName) as never) : null;
    }

    /**
     * The path may traverse object properties (`layer.call('tileDecoder.setStyleParameter', ...)`).
     * An object result is a `MassifObject` the CALLER OWNS - `destroy()` it, or it stays registered.
     */
    call<M extends MethodName<C>>(method: M, ...args: MethodArgs<C, M>): CallResult<C, M> {
        return this.invoke(method as string, args) as CallResult<C, M>;
    }

    /** Untyped `call` for the named wrappers: they know the declaring class, `call`'s `C` does not. */
    protected invoke(method: string, args: readonly unknown[]): unknown {
        const info = resolveMethod(this.className, method);
        let result: number;
        try {
            result = bridge.call(this.handle, method, argsJson(args));
        } catch (e) {
            throw new MassifApiError(`${this.className}.${method}: ${e?.message ?? e}`);
        }
        return this.readResult(result, info?.code, info?.arg, true);
    }

    private readResult(handle: number, code: string | undefined, cls: string | undefined, owned: boolean): unknown {
        if (!handle) {
            return undefined;
        }
        try {
            switch (code) {
                case 'v':
                    return undefined;
                case 'b':
                    return bridge.getBool(handle, '', false);
                case 'i':
                    return bridge.getInt(handle, '', 0);
                case 'f':
                    return bridge.getFloat(handle, '', 0);
                case 's':
                    return bridge.getString(handle, '');
                case 'd':
                    return bridge.getDoubles(handle);
                case 'o': {
                    if (!cls) {
                        // a missing class means the tables are older than the SDK
                        throw new MassifApiError('an object result with no class - regenerate the typings with `npm run typings.api`');
                    }
                    // The caller owns it, so it must NOT be destroyed here.
                    owned = false;
                    return new MassifObject(handle as Handle, cls as ClassName);
                }
                default:
                    return parseJson(bridge.getString(handle, ''));
            }
        } finally {
            if (owned) {
                bridge.destroy(handle);
            }
        }
    }

    /**
     * `call` on a worker. `extract` runs INSIDE the delivery, the only time an object result is alive,
     * e.g. `(tile) => tile.getData('data')`. Scalars and flat arrays need no `extract`.
     */
    callAsync<M extends MethodName<C>, R = CallResult<C, M>>(method: M, args: MethodArgs<C, M>, extract?: (result: MassifObject<ResultClass<C, M>>) => R): CancellablePromise<R> {
        const info = resolveMethod(this.className, method as string);
        if (info?.code === 'o' && !extract) {
            // an async object result dies with the delivery: handing it back would dangle
            throw new MassifApiError(`${this.className}.${String(method)} returns an object - pass an extract function, it runs while the result is alive`);
        }
        const event = `${String(method)}.done.${nextCallId()}`;
        let call = 0;
        let subscription: Subscription | undefined;

        const promise = new Promise<R>((resolve, reject) => {
            subscription = this.subscribeRaw(event, (payload) => {
                subscription?.remove();
                if (!payload) {
                    reject(new MassifApiError(`${this.className}.${String(method)} failed`));
                    return false;
                }
                try {
                    // Never owned: the facade releases an async payload after the handlers run.
                    const value = info?.code === 'o' || extract ? new MassifObject(payload as Handle, (info?.arg ?? this.className) as ClassName) : null;
                    resolve(extract ? extract(value as never) : (this.readResult(payload, info?.code, info?.arg, false) as R));
                } catch (e) {
                    reject(e);
                }
                return false;
            });
            try {
                call = bridge.callAsync(this.handle, method as string, argsJson(args), event);
            } catch (e) {
                subscription?.remove();
                reject(new MassifApiError(`${this.className}.${String(method)}: ${e?.message ?? e}`));
            }
        }) as CancellablePromise<R>;

        promise.cancel = () => {
            const cancelled = call ? bridge.cancelCall(call) : false;
            subscription?.remove();
            return cancelled;
        };
        return promise;
    }

    cancelCalls(): number {
        return bridge.cancelCalls(this.handle);
    }

    /**
     * Defaults cover a search result; a route's instructions are
     * `collect(fn, { countPath: 'instructionCount', method: 'getInstruction' })`.
     */
    collect<R>(map: (element: MassifObject<ResultClass<C, MethodName<C> & 'getFeature'>>, index: number) => R): R[];
    collect<M extends MethodName<C>, R>(map: (element: MassifObject<ResultClass<C, M>>, index: number) => R, options: { countPath: string; method: M }): R[];
    collect<R>(map: (element: any, index: number) => R, options: { countPath?: string; method?: string } = {}): R[] {
        const countPath = options.countPath ?? 'featureCount';
        const method = options.method ?? 'getFeature';
        const count = bridge.getInt(this.handle, countPath, 0);
        const out: R[] = [];
        for (let i = 0; i < count; i++) {
            const element = this.invoke(method, [i]) as MassifObject;
            if (!element) {
                continue;
            }
            try {
                out.push(map(element, i));
            } finally {
                element.destroy();
            }
        }
        return out;
    }

    /** Escape hatch for paths the tables cannot type: free-form feature properties, a more derived class. */
    json(path = ''): Json {
        return parseJson(bridge.getString(this.handle, path));
    }

    /** An empty path means the handle IS the blob. */
    getData(path = ''): ArrayBuffer | null {
        return bridge.getData(this.handle, path);
    }

    getDoubles(): number[] {
        return bridge.getDoubles(this.handle);
    }

    /** Defaults for every later subscription on this object. */
    eventOptions(options: SubscribeOptions): this {
        this.mDefaults = { ...this.mDefaults, ...options };
        return this;
    }

    get events(): string[] {
        return eventNames(this.className);
    }

    /** For a handler needing its own projection or delivery; `on` covers most cases. */
    subscribe<E extends EventName<C>>(event: E, handler: (data: MassifEventData<C, E>) => void, options?: SubscribeOptions): Subscription {
        const consumable = this.consumes(event as string);
        return this.subscribeRaw(
            event as string,
            (payload, snapshot) => {
                const data = this.eventData(event as string, payload, consumable, snapshot) as unknown as MassifEventData<C, E>;
                handler(data);
                warnIfIgnored(data, consumable, event as string);
                return consumable && data.consumed;
            },
            options
        );
    }

    private consumes(event: string): boolean {
        return bridge.canConsume && !!findEvent(this.className, event)?.consume;
    }

    private subscribeRaw(event: string, handler: (payload: number, snapshot?: Json) => boolean, options?: SubscribeOptions): Subscription {
        requireApi();
        this.beforeSubscribe(event);
        const merged = { ...this.mDefaults, ...options };
        const throttle = merged.throttle ?? 0;
        const debounce = merged.debounce ?? 0;
        const consumable = this.consumes(event);
        if (debounce && consumable) {
            throw new MassifApiError(`${event} is consumable, so it cannot be debounced - the SDK is waiting for the answer now, not in ${debounce} ms`);
        }
        let last = 0;
        let timer: any = null;

        const deliver = (payload: number) => {
            if (throttle) {
                // Date.now() rather than a timer: dropping is the point, and a queued handler
                // would read a payload the facade has already freed.
                const now = Date.now();
                if (now - last < throttle) {
                    return false;
                }
                last = now;
            }
            if (debounce) {
                // the payload dies when this returns, so snapshot it NOW; trailing edge, only the
                // last of a burst is delivered
                const snapshot = payload ? parseJson(bridge.getString(payload as Handle, '')) : null;
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(() => {
                    timer = null;
                    try {
                        handler(0, snapshot);
                    } catch (error) {
                        console.error(`MassifMaps: debounced handler for '${event}' threw`, error);
                    }
                }, debounce);
                return false;
            }
            return handler(payload);
        };

        const id = bridge.on(
            this.handle,
            event,
            (_target, _event, payload) => {
                try {
                    return deliver(payload);
                } catch (error) {
                    // returns through a SWIG director into C++: an exception crossing it aborts the PROCESS
                    console.error(`MassifMaps: handler for '${event}' threw`, error);
                    return false;
                }
            },
            DELIVERY_ORIGIN,
            false,
            merged.projection ?? '',
            consumable
        );
        if (!id) {
            throw new MassifApiError(`could not subscribe to ${event} on ${this.className} - a stale handle, or an unknown projection`);
        }
        const subscription = new Subscription(id);
        if (debounce) {
            subscription.onRemove(() => {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
            });
        }
        return subscription;
    }

    /** Hook for a subclass that has to install a native listener before the first subscription. */
    protected beforeSubscribe(event: string) {
        // nothing by default
    }

    private eventData(event: string, payload: number, consumable: boolean, snapshot?: Json): MassifEventData {
        const info = findEvent(this.className, event);
        // a debounced delivery has no live payload left, it reads the snapshot taken at emit time
        const fromSnapshot = snapshot !== undefined && snapshot !== null;
        // Wrapped lazily: an event nobody reads should not allocate an Observable per delivery.
        let object: MassifObject | null | undefined;
        const payloadObject = () => {
            if (object === undefined) {
                object = payload && info?.payload ? new MassifObject(payload as Handle, info.payload as ClassName) : null;
            }
            return object;
        };
        // Only when a payload actually ARRIVED, not merely when the schema says the event has
        // one: an older SDK sends none, and a getter that read through would throw.
        const proto = (payload || fromSnapshot) && info?.payload ? payloadProto(info.payload) : null;
        const data = Object.assign(proto ? Object.create(proto) : {}, {
            eventName: event,
            object: this as MassifObject,
            consumed: false,
            consumable,
            get: (path: string) => {
                if (fromSnapshot) {
                    return path ? (snapshot as any)[path] : snapshot;
                }
                const target = payloadObject();
                if (!target) {
                    throw new MassifApiError(`${event} carries no payload`);
                }
                return target.get(path as never);
            },
            getPos: (path: string, projection?: ProjectionName) => {
                if (fromSnapshot) {
                    return ((snapshot as any)[path] ?? null) as never;
                }
                const target = payloadObject();
                return target ? target.getPos(path, projection) : null;
            }
        }) as MassifEventData;
        // `payload` is a getter of its own so the wrapper is still only built if it is asked for.
        Object.defineProperty(data, 'payload', { enumerable: true, configurable: true, get: payloadObject });
        return data;
    }

    /** Deliberately NOT widened to `string` so event-name typos fail; `addEventListener` takes any name. */
    on<E extends EventName<C>>(event: E, callback: (data: MassifEventData<C, E>) => void, thisArg?: any): void {
        super.on(event, callback as never, thisArg);
    }

    once<E extends EventName<C>>(event: E, callback: (data: MassifEventData<C, E>) => void, thisArg?: any): void {
        super.once(event, callback as never, thisArg);
    }

    off<E extends EventName<C>>(event: E, callback?: any, thisArg?: any): void {
        super.off(event, callback, thisArg);
    }

    /** A facade event takes its native subscription here, on the first handler. */
    addEventListener(eventNames: string, callback: (data: EventData) => void, thisArg?: any, ...rest: any[]) {
        (super.addEventListener as any)(eventNames, callback, thisArg, ...rest);
        for (const name of splitEvents(eventNames)) {
            if (!this.mSubscriptions[name] && findEvent(this.className, name) !== null) {
                const consumable = this.consumes(name);
                this.mSubscriptions[name] = this.subscribeRaw(name, (payload, snapshot) => {
                    // One data object for every listener, so whichever of them sets `consumed`
                    // claims the event - the same rule as a DOM handler calling preventDefault.
                    const data = this.eventData(name, payload, consumable, snapshot);
                    this.notify(data);
                    warnIfIgnored(data, consumable, name);
                    return consumable && data.consumed;
                });
            }
        }
    }

    removeEventListener(eventNames: string, callback?: any, thisArg?: any) {
        super.removeEventListener(eventNames, callback, thisArg);
        for (const name of splitEvents(eventNames)) {
            if (this.mSubscriptions[name] && !this.hasListeners(name)) {
                this.mSubscriptions[name].remove();
                delete this.mSubscriptions[name];
            }
        }
    }

    /** Subscriptions and pending async calls die with it, so no handler runs against a freed object. */
    destroy(): boolean {
        if (this.mDestroyed) {
            return false;
        }
        this.mDestroyed = true;
        for (const name of Object.keys(this.mSubscriptions)) {
            this.mSubscriptions[name].remove();
        }
        this.mSubscriptions = {};
        return bridge.destroy(this.handle);
    }

    toString() {
        return `${this.constructor.name}(${this.className}#${this.handle}${this.id ? ` "${this.id}"` : ''})`;
    }
}

function splitEvents(eventNames: string): string[] {
    return eventNames
        .split(',')
        .map((n) => n.trim())
        .filter(Boolean);
}

let callId = 0;
function nextCallId() {
    return ++callId;
}

const warnedConsume: { [event: string]: boolean } = {};

function warnIfIgnored(data: { consumed: boolean }, consumable: boolean, event: string) {
    if (!data.consumed || consumable || warnedConsume[event]) {
        return;
    }
    warnedConsume[event] = true;
    const why = bridge.canConsume ? 'it is not a consumable event' : "this SDK's MassifApi.on does not take the consume flag";
    console.warn(`massif: a handler consumed ${event} but nothing will act on it - ${why}`);
}

function resultName(result: number): string {
    for (const name of Object.keys(Result)) {
        if ((Result as never)[name] === result) {
            return name;
        }
    }
    return `result ${result}`;
}

/** Click events need a listener on the NATIVE layer, installed on first subscription (chaining any existing one). */
export class MassifLayer<C extends ClassName = any> extends MassifObject<C> {
    private mBridged: { [event: string]: boolean } = {};

    /** Set when built or adopted through a map; needed to reorder or detach it. */
    map?: MassifMap;

    protected beforeSubscribe(event: string) {
        if (this.mBridged[event] || !this.id) {
            return;
        }
        let attached = true;
        if (event === 'vectortile.clicked') {
            attached = bridge.attachVectorTileEvents(this.handle);
        } else if (event === 'vectorelement.clicked') {
            attached = bridge.attachVectorElementEvents(this.handle);
        } else if (event === 'celestial.clicked' || event === 'sky.clicked') {
            // One native bridge emits both: attaching a second would report every click twice.
            if (!this.mBridged['celestial.clicked'] && !this.mBridged['sky.clicked']) {
                attached = bridge.attachCelestialEvents(this.handle);
            }
        } else {
            return;
        }
        if (attached) {
            this.mBridged[event] = true;
        }
    }

    get native(): any {
        return this.id ? bridge.getNativeLayer(this.id) : bridge.getNativeLayerByHandle(this.handle);
    }

    opacity(): number;
    opacity(value: number): this;
    opacity(value?: number) {
        return value === undefined ? (this.get('opacity' as never) as number) : this.set('opacity' as never, value as never);
    }

    visible(): boolean;
    visible(value: boolean): this;
    visible(value?: boolean) {
        return value === undefined ? (this.get('visible' as never) as boolean) : this.set('visible' as never, value as never);
    }

    zoomRange(): [number, number];
    zoomRange(range: [number, number]): this;
    zoomRange(range?: [number, number]) {
        return range === undefined ? (this.get('visibleZoomRange' as never) as [number, number]) : this.set('visibleZoomRange' as never, range as never);
    }

    /** 0 is the bottom of the map's stack. */
    moveTo(index: number): this {
        // insert does not take a layer out first: without the remove it is on the stack twice.
        const layers = this.requireMap().layers();
        layers.remove(this);
        layers.insert(Math.min(index, layers.count()), this);
        return this;
    }

    /** The object stays registered until it is destroyed. */
    detach(): this {
        this.requireMap().layers().remove(this);
        return this;
    }

    refresh(): this {
        this.invoke('refresh', []);
        return this;
    }

    /** OWNED by the caller. Typed as a source so `.native` is there, to hand the tiles to native code. */
    source(): MassifSource | null {
        const child = this.child('dataSource' as never);
        return child ? new MassifSource(child.handle, child.className) : null;
    }

    /** `all` includes the preloading caches, not just the visible set. */
    clearTileCaches(all = false): this {
        this.invoke('clearTileCaches', [all]);
        return this;
    }

    /** Only a hillshade layer answers; anything else gives an empty array. */
    elevations(positions: AnyPosition[]): number[] {
        try {
            return this.invoke('getElevations', [positions.map(toPosition)]) as number[];
        } catch (e) {
            return [];
        }
    }

    // payload class named OUTRIGHT: on an unnarrowed MassifLayer (the common case) MassifEventData<C, EventName<C>>
    // resolves to MassifEventData<any, string>, which has no payload fields

    onFeatureClick(handler: (data: MassifEventData<'massif::VectorTileLayer', 'vectortile.clicked'>) => void, options?: SubscribeOptions): Subscription {
        return this.subscribe('vectortile.clicked' as EventName<C>, handler as never, options);
    }

    onElementClick(handler: (data: MassifEventData<'massif::VectorLayer', 'vectorelement.clicked'>) => void, options?: SubscribeOptions): Subscription {
        return this.subscribe('vectorelement.clicked' as EventName<C>, handler as never, options);
    }

    onCelestialClick(handler: (data: MassifEventData<'massif::CelestialLayer', 'celestial.clicked'>) => void, options?: SubscribeOptions): Subscription {
        return this.subscribe('celestial.clicked' as EventName<C>, handler as never, options);
    }

    onSkyClick(handler: (data: MassifEventData<'massif::CelestialLayer', 'sky.clicked'>) => void, options?: SubscribeOptions): Subscription {
        return this.subscribe('sky.clicked' as EventName<C>, handler as never, options);
    }

    private requireMap(): MassifMap {
        if (!this.map) {
            throw new MassifApiError(`layer is not attached to a map: ${this}`);
        }
        return this.map;
    }
}

export class MassifSource<C extends ClassName = any> extends MassifObject<C> {
    get native(): any {
        return this.id ? bridge.getNativeSource(this.id) : bridge.getNativeSourceByHandle(this.handle);
    }

    /** BLOCKING: an HTTP source fetches on the calling thread. Use `loadTileAsync` from the UI thread. */
    loadTile(tile: Tile): ArrayBuffer | null {
        const result = this.invoke('loadTile', [tile]) as MassifObject;
        try {
            return result ? result.getData('data') : null;
        } finally {
            result?.destroy();
        }
    }

    /** For a `geojson` source; returns the layer index. */
    createLayer(name: string): number {
        return this.invoke('createLayer', [name]) as number;
    }

    /** A string is parsed here: args cross as JSON, so text would arrive as a string argument, not a document. */
    setGeoJSON(layer: number, geojson: Json | string | object): this {
        this.invoke('setLayerGeoJSON', [layer, typeof geojson === 'string' ? JSON.parse(geojson) : geojson]);
        return this;
    }

    deleteLayer(layer: number): this {
        this.invoke('deleteLayer', [layer]);
        return this;
    }

    /** Avoids re-tiling the whole document as `setGeoJSON` does. `update` matches on the feature's own `id`. */
    addFeature(layer: number, feature: Json | string | object): this {
        this.invoke('addFeature', [layer, feature]);
        return this;
    }

    updateFeature(layer: number, feature: Json | string | object): this {
        this.invoke('updateFeature', [layer, feature]);
        return this;
    }

    removeFeature(layer: number, id: string | number): this {
        this.invoke('removeFeature', [layer, id]);
        return this;
    }

    loadTileAsync(tile: Tile): CancellablePromise<ArrayBuffer | null> {
        return this.callAsync('loadTile' as never, [tile] as never, ((result: MassifObject) => result.getData('data')) as never) as CancellablePromise<ArrayBuffer | null>;
    }
}

const WRAPPERS: { [kind: string]: new (handle: Handle, className: ClassName, id?: string) => MassifObject } = {
    layer: MassifLayer as never,
    source: MassifSource as never
};

function wrapperFor(kind: string) {
    return WRAPPERS[kind] ?? MassifObject;
}

/**
 * Spec keys are constructor params plus writable properties; nested `source`/`style`/`assets` are inline
 * specs or registered ids. Re-creating an id with an IDENTICAL spec returns the same object; a different one is refused.
 */
export function create<K extends Kind, T extends SpecType<K>>(kind: K, id: string, spec: SpecArg<K, T>): MassifObject<ClassOfSpec<K, T>>;
/**
 * For kinds with HAND-WRITTEN factories (`projection`, `data`, `geometry`, `search`/`routing`). `className`
 * is REQUIRED, else this overload would accept a misspelt key in a kind the schema does describe.
 */
export function create<C extends ClassName>(kind: string, id: string, spec: { type: string } & { [key: string]: Json }, className: C): MassifObject<C>;
export function create(kind: string, id: string, spec: { type: string }, className?: ClassName): MassifObject {
    requireApi();
    let handle: number;
    try {
        handle = bridge.create(kind, id, JSON.stringify(spec));
    } catch (e) {
        throw new MassifApiError(`create ${kind}:${id}: ${e?.message ?? e}`);
    }
    if (!handle) {
        throw new MassifApiError(`create ${kind}:${id} returned no handle`);
    }
    // hand-written factory kinds do not name their class; a bare Layer is the least wrong fallback
    const resolved = className ?? classOfSpec(kind, spec.type) ?? 'massif::Layer';
    return new (wrapperFor(kind))(handle as Handle, resolved as ClassName, id) as never;
}

export function createLayer<T extends SpecType<'layer'>>(id: string, spec: SpecArg<'layer', T>): MassifLayer<ClassOfSpec<'layer', T>> {
    return create('layer', id, spec) as never;
}

export function createSource<T extends SpecType<'source'>>(id: string, spec: SpecArg<'source', T>): MassifSource<ClassOfSpec<'source', T>> {
    return create('source', id, spec) as never;
}

/** The class cannot be read back off a handle; it is what the property paths resolve against. */
export function find<C extends ClassName>(kind: Kind | string, id: string, className: C): MassifObject<C> | null {
    requireApi();
    const handle = bridge.findObject(kind, id);
    if (!handle) {
        return null;
    }
    return new (wrapperFor(kind))(handle as Handle, className, id) as never;
}

export function destroy(kind: Kind | string, id: string): boolean {
    return bridge.available ? bridge.unregisterObject(kind, id) : false;
}

/** Nothing is checked; the class is what the paths resolve against. */
export function wrap<C extends ClassName>(handle: number, className: C, id?: string): MassifObject<C> {
    return new MassifObject(handle as Handle<C>, className, id);
}

/**
 * For a layer unreachable by id, e.g. a CompositeVectorTileLayer's external child from `getExternalChildLayer`.
 * Not in a map's stack, so `moveTo` / `detach` throw.
 */
export function wrapLayer<C extends ClassName>(handle: number, className: C, id?: string): MassifLayer<C> {
    return new MassifLayer(handle as Handle<C>, className, id);
}

/**
 * Gives an object built with the OBJECT api an id. The class is read off the native runtime class, so an
 * adopted `VectorTileLayer` answers to its own properties, not only `Layer`'s.
 */
export function adoptLayer(id: string, nativeLayer: any, className?: ClassName): MassifLayer {
    requireApi();
    const handle = bridge.adoptLayer('layer', id, nativeLayer);
    if (!handle) {
        throw new MassifApiError(`could not adopt layer "${id}" - the id is taken, or the class is not a wrapped one`);
    }
    return new MassifLayer(handle as Handle, resolveNativeClass(nativeLayer, className, 'massif::Layer'), id);
}

/** @copydoc adoptLayer */
export function adoptSource(id: string, nativeSource: any, className?: ClassName): MassifSource {
    requireApi();
    const handle = bridge.adoptSource('source', id, nativeSource);
    if (!handle) {
        throw new MassifApiError(`could not adopt source "${id}" - the id is taken, or the class is not a wrapped one`);
    }
    return new MassifSource(handle as Handle, resolveNativeClass(nativeSource, className, 'massif::TileDataSource'), id);
}

/**
 * Also takes an app SUBCLASS, which a spec cannot express; specs then pass the id as `assets`. A Swig
 * director has no class the registry knows, so it is adopted as `massif::AssetPackage`.
 */
export function adoptAssets(id: string, nativeAssets: any, className?: ClassName): MassifObject {
    requireApi();
    const handle = bridge.adoptAssets('assets', id, nativeAssets);
    if (!handle) {
        throw new MassifApiError(`could not adopt assets "${id}" - the id is taken, or the class is not a wrapped one`);
    }
    return new MassifObject(handle as Handle, resolveNativeClass(nativeAssets, className, 'massif::AssetPackage'), id);
}

function resolveNativeClass(nativeObject: any, given: ClassName | undefined, fallback: ClassName): ClassName {
    if (given) {
        if (!isKnownClass(given)) {
            throw new MassifApiError(`${given} is not a class the typings know - regenerate them with \`npm run typings.api\``);
        }
        return given;
    }
    return (classOfShortName(bridge.nativeShortClassName(nativeObject)) as ClassName) ?? fallback;
}

/** Markers and popups; elements and styles are specs. The layer and source are created on first use, released with the map. */
export class MassifElements {
    private mSource?: MassifObject<'massif::LocalVectorDataSource'>;
    private mLayer?: MassifLayer<'massif::VectorLayer'>;
    private mCounter = 0;

    constructor(
        private readonly map: MassifMap,
        private readonly id: string,
        /** Where the positions are read. lon/lat by default, matching the rest of this API. */
        private readonly sourceSpec?: SpecArg<'source', 'local'>
    ) {}

    /** The spec's `style` either names a registered style or carries it inline. */
    add<T extends SpecType<'element'>>(spec: SpecArg<'element', T>): MassifObject<ClassOfSpec<'element', T>> {
        const element = this.map.object('element', `${this.id}.el${++this.mCounter}`, spec);
        this.built().source.call('add', element.handle);
        return element;
    }

    /** Lets many elements share ONE style object, which matters once there are thousands. */
    style<T extends SpecType<'elementstyle'>>(styleId: string, spec: SpecArg<'elementstyle', T>): MassifObject<ClassOfSpec<'elementstyle', T>> & { readonly id: string } {
        // `id` narrowed to non-optional: a style is only useful as the `style` key of an element
        // spec, and an optional string would make every call site write `!`.
        return this.map.object('elementstyle', `${this.id}.${styleId}`, spec) as never;
    }

    /** The element stays registered until it is destroyed. */
    remove(element: MassifObject | null): boolean {
        return this.mSource && element ? this.mSource.call('remove', element.handle) : false;
    }

    clear(): this {
        this.mSource?.call('clear');
        return this;
    }

    /** Set `e.consumed` to claim the tap, otherwise it also reaches the map. */
    onClick(handler: (data: MassifEventData<'massif::VectorLayer', 'vectorelement.clicked'>) => void, options?: SubscribeOptions): Subscription {
        return this.built().layer.subscribe('vectorelement.clicked', handler, options);
    }

    layer(): MassifLayer<'massif::VectorLayer'> {
        return this.built().layer;
    }

    source(): MassifObject<'massif::LocalVectorDataSource'> {
        return this.built().source;
    }

    private built() {
        if (!this.mSource || !this.mLayer) {
            // projection as a NESTED SPEC: a string is a registry id lookup, and EPSG:4326 is a
            // type the projection factory builds, not a registered id
            this.mSource = this.map.object('source', this.id, this.sourceSpec ?? { type: 'local', projection: { type: 'EPSG:4326' } });
            this.mLayer = this.map.addLayer(this.id, { type: 'elements', source: this.id });
        }
        return { source: this.mSource, layer: this.mLayer };
    }
}

/** Structural rather than the view class, so `api/` does not import `ui/`. The camera goes through the facade. */
export interface MapViewLike {
    mapView: any;
    getOptions(): { getNative(): any } | null;
    getMeasuredWidth?(): number;
    getMeasuredHeight?(): number;
    /** Platform code: there is no facade verb for a framebuffer read. */
    captureRendering?(wait?: boolean): Promise<any>;
    /** Platform code: the renderer is not in the property table. */
    requestRedraw?(): void;
}

/** `Log` is static-only, so the context registers it as `static:Log`. */
export function log(): MassifObject<'massif::Log'> {
    return find('static', 'Log', 'massif::Log');
}

export function mapViewClass(): any {
    // required lazily, so `api` does not pull `ui` in at import time
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('../ui').MassifMap;
}

/**
 * Facade calls on the ADOPTED map view, so no position becomes a `MapPos` proxy (massif-maps/MassifMaps#159).
 * Positions are WGS84 `[lng, lat]`.
 */
export class MapCamera {
    /** Whether the linked SDK binary has BaseMapView::moveCameraTo; undefined until first tried. */
    private static nativeCameraMove: boolean | undefined;

    private mDuration = 0;

    /** @param size The view's pixel size: BaseMapView exposes none, so the map measures it. */
    constructor(
        private readonly view: MassifObject<'massif::BaseMapView'>,
        private readonly size: () => { width: number; height: number }
    ) {}

    /** Milliseconds the NEXT move animates over; reset once used. */
    animate(ms: number): this {
        this.mDuration = ms;
        return this;
    }

    /** Seconds, which is what the facade takes; the public API is milliseconds. */
    private take(duration?: number): number {
        const ms = duration ?? this.mDuration;
        this.mDuration = 0;
        return ms / 1000;
    }

    position(): Position;
    position(value: AnyPosition): this;
    position(value?: AnyPosition) {
        if (value === undefined) {
            return this.view.getPos('focusPos') as Position;
        }
        return this.moveTo(value);
    }

    /** Where the camera IS, not what it looks at - kilometres apart at a low tilt. */
    eyePosition(): Position;
    eyePosition(value: AnyPosition): this;
    eyePosition(value?: AnyPosition) {
        if (value === undefined) {
            return this.view.getPos('cameraPos') as Position;
        }
        return this.moveEyeTo(value);
    }

    /** Puts the EYE at a position, where `moveTo` puts the focus. */
    moveEyeTo(position: AnyPosition, options: { zoom?: number; rotation?: number; tilt?: number; climbHeight?: number; duration?: number } = {}): this {
        const target = toPosition(position);
        const seconds = this.take(options.duration);
        // Probed by calling it: the schema these typings come from can be newer than the linked
        // binary. Older SDKs fall back to solving for the focus below.
        if (seconds <= 0 && MapCamera.nativeCameraMove !== false) {
            try {
                this.view.call('moveCameraTo', target, options.zoom ?? this.zoom(), options.rotation ?? this.rotation(), options.tilt ?? this.tilt());
                MapCamera.nativeCameraMove = true;
                return this;
            } catch {
                MapCamera.nativeCameraMove = false;
            }
        }
        // Resolved once: the getters read a snapshot republished per DRAWN frame, so re-reading
        // them mid-solve on an undrawn map snaps the orientation back to the previous view.
        const orientation = {
            zoom: options.zoom ?? this.zoom(),
            rotation: options.rotation ?? this.rotation(),
            tilt: options.tilt ?? this.tilt()
        };
        // Start as moveTo would, so a failed or clamped solve still leaves the view on the target.
        this.moveTo(target, orientation);
        // 1e-7 degrees is about a centimetre.
        const TOLERANCE = 1e-7;
        const MAX_STEPS = 6;
        const startFocus = this.readPos('focusPos');
        if (!startFocus) {
            return this;
        }
        let focus = startFocus;
        // The focus is clamped (restricted panning, pan bounds), so a step may not apply: keep the
        // best focus seen instead of the last one.
        let bestFocus = focus;
        let bestError = Number.POSITIVE_INFINITY;
        for (let step = 0; step < MAX_STEPS; step++) {
            const eye = this.readPos('cameraPos');
            if (!eye) {
                break;
            }
            const deltaLng = target[0] - eye[0];
            const deltaLat = target[1] - eye[1];
            const error = Math.abs(deltaLng) + Math.abs(deltaLat);
            if (error < bestError) {
                bestError = error;
                bestFocus = focus;
            }
            if (error < TOLERANCE) {
                break;
            }
            const candidate: [number, number] = [focus[0] + deltaLng, focus[1] + deltaLat];
            this.moveTo(candidate, orientation);
            const applied = this.readPos('focusPos');
            if (!applied) {
                break;
            }
            if (Math.abs(applied[0] - focus[0]) < TOLERANCE && Math.abs(applied[1] - focus[1]) < TOLERANCE) {
                break;
            }
            focus = applied;
        }
        focus = bestFocus;
        this.moveTo(focus, orientation);
        if (seconds > 0) {
            // The solve moved the camera; rewind to the start and fly the rest.
            this.moveTo(startFocus, orientation);
            this.view.call('flyTo', focus, orientation.zoom, orientation.rotation, orientation.tilt, options.climbHeight ?? 0, seconds, 'ease');
        }
        return this;
    }

    /** Null, not a throw or NaN, for a view that has not had its first layout. */
    private readPos(path: 'focusPos' | 'cameraPos'): [number, number] | null {
        try {
            const pos = this.view.getPos(path) as Position;
            if (!pos || !isFinite(pos[0]) || !isFinite(pos[1])) {
                return null;
            }
            return [pos[0], pos[1]];
        } catch {
            return null;
        }
    }

    zoom(): number;
    zoom(value: number, target?: AnyPosition): this;
    zoom(value?: number, target?: AnyPosition) {
        if (value === undefined) {
            return this.view.get('zoom') as number;
        }
        return this.moveTo(target ?? this.position(), { zoom: value });
    }

    rotation(): number;
    rotation(degrees: number): this;
    rotation(degrees?: number) {
        if (degrees === undefined) {
            return this.view.get('rotation') as number;
        }
        return this.moveTo(this.position(), { rotation: degrees });
    }

    tilt(): number;
    tilt(degrees: number): this;
    tilt(degrees?: number) {
        if (degrees === undefined) {
            return this.view.get('tilt') as number;
        }
        return this.moveTo(this.position(), { tilt: degrees });
    }

    /**
     * What the old map view had as pan, zoom, rotate and tilt: relative to where the camera is now, one move
     * like `moveTo`, animated by `animate`. `panBy` is in degrees; rotation is positive clockwise.
     */
    panBy(deltaLng: number, deltaLat: number): this {
        const [lng, lat, alt] = this.position();
        return this.moveTo(alt === undefined ? [lng + deltaLng, lat + deltaLat] : [lng + deltaLng, lat + deltaLat, alt]);
    }

    zoomBy(delta: number): this {
        return this.zoom(this.zoom() + delta);
    }

    rotateBy(degrees: number): this {
        return this.rotation(this.rotation() + degrees);
    }

    tiltBy(degrees: number): this {
        return this.tilt(this.tilt() + degrees);
    }

    /**
     * All in ONE move: separate setters animate independently and fight each other. With no duration it
     * is immediate and works before the map has drawn.
     */
    moveTo(position: AnyPosition, options: { zoom?: number; rotation?: number; tilt?: number; climbHeight?: number; duration?: number } = {}): this {
        const pos = toPosition(position);
        const zoom = options.zoom ?? this.zoom();
        const rotation = options.rotation ?? this.rotation();
        const tilt = options.tilt ?? this.tilt();
        const seconds = this.take(options.duration);
        if (seconds > 0) {
            this.view.call('flyTo', pos, zoom, rotation, tilt, options.climbHeight ?? 0, seconds, 'ease');
        } else {
            this.view.call('moveTo', pos, zoom, rotation, tilt);
        }
        return this;
    }

    /** `screen` defaults to the whole view. */
    fitBounds(
        bounds: Bounds,
        options: { screen?: { min: { x: number; y: number }; max: { x: number; y: number } }; integerZoom?: boolean; resetRotation?: boolean; resetTilt?: boolean; duration?: number } = {}
    ): this {
        const { width, height } = this.size();
        const screen = options.screen
            ? [[options.screen.min.x, options.screen.min.y], [options.screen.max.x, options.screen.max.y]]
            : [[0, 0], [width, height]];
        this.view.call(
            'fitBounds',
            [toPosition(bounds[0]), toPosition(bounds[1])],
            screen,
            !!options.integerZoom,
            !!options.resetRotation,
            !!options.resetTilt,
            this.take(options.duration)
        );
        return this;
    }

    isMoving(): boolean {
        return this.view.get('flightActive') as boolean;
    }

    /** 0 to 1 through the current flight, or -1 when none is running. */
    progress(): number {
        return this.view.get('flightProgress') as number;
    }

    stop(): this {
        this.view.call('stopFlight');
        return this;
    }

    screenToMap(x: number, y: number): Position {
        return this.view.call('screenToMap', x, y) as Position;
    }

    mapToScreen(position: AnyPosition): { x: number; y: number } {
        const point = this.view.call('mapToScreen', toPosition(position)) as [number, number];
        return { x: point[0], y: point[1] };
    }

    /** Axis-aligned box around the two unprojected screen corners: a tilted/rotated camera has no true bounds. */
    bounds(): Bounds {
        const { height, width } = this.size();
        const first = this.screenToMap(0, 0);
        const second = this.screenToMap(width, height);
        return [
            [Math.min(first[0], second[0]), Math.min(first[1], second[1])],
            [Math.max(first[0], second[0]), Math.max(first[1], second[1])]
        ];
    }
}

/** Drawn in list order, 0 at the bottom. Facade calls on the adopted `Layers` only. */
export class MapLayers extends MassifObject<'massif::Layers'> {
    constructor(handle: Handle<'massif::Layers'>, id: string) {
        super(handle, 'massif::Layers', id);
    }

    /** Includes layers the object API put there. */
    count(): number {
        return this.get('count');
    }

    /** Appends on top: 0 is the bottom. */
    add(layer: MassifLayer | number): this {
        this.call('add', handleOf(layer) as Handle);
        return this;
    }

    insert(index: number, layer: MassifLayer | number): this {
        this.call('insert', index, handleOf(layer) as Handle);
        return this;
    }

    /** Not `set`: a two-argument overload of the property writer would let `layers.set('count', …)` typos compile. */
    replace(index: number, layer: MassifLayer | number): this {
        this.call('set', index, handleOf(layer) as Handle);
        return this;
    }

    /** A bare `Layer`: the list does not record the concrete class. */
    at(index: number): MassifLayer<'massif::Layer'> | null {
        const layer = this.call('get', index) as unknown as MassifObject<'massif::Layer'> | undefined;
        return layer ? new MassifLayer(layer.handle as Handle, 'massif::Layer') : null;
    }

    remove(layer: MassifLayer | number): boolean {
        return this.call('remove', handleOf(layer) as Handle);
    }

    clear(): this {
        this.call('clear');
        return this;
    }
}

export interface AttachOptions extends SubscribeOptions {
    /** The registry id the map's options take. Defaults to `map`. */
    id?: string;
}

/** Addressed through its Options: fog, sky, light, terrain, camera limits... all hang off it. */
export class MassifMap extends MassifObject<'massif::Options'> {
    private mLayers?: MapLayers;
    private mCamera?: MapCamera;
    private mElements?: MassifElements;
    private readonly mLayerById: { [id: string]: MassifLayer } = {};
    /** Ids this map built, released when it is destroyed. */
    private readonly mOwned: [string, string][] = [];

    constructor(
        handle: Handle<'massif::Options'>,
        id: string,
        readonly view: MapViewLike,
        /** Set when the native view registered its own map, view and layers: they go with the view, not with this wrapper. */
        private readonly native: { view: number; layers: number } | null = null
    ) {
        super(handle, 'massif::Options', id);
    }

    layers(): MapLayers {
        if (!this.mLayers) {
            const id = this.native ? this.id : `${this.id}:layers`;
            // reuse an existing one: adopt() REFUSES a duplicate id (a map re-attached under the
            // same id), and the id outlives the MassifMap that made it
            let handle = this.native ? this.native.layers : bridge.findObject('layers', id);
            if (!handle) {
                handle = bridge.adoptLayers('layers', id, this.view.mapView.getLayers());
                if (!handle) {
                    throw new MassifApiError(`could not register the layer list of "${this.id}" under "${id}"`);
                }
                this.mOwned.push(['layers', id]);
            }
            this.mLayers = new MapLayers(handle as Handle<'massif::Layers'>, id);
        }
        return this.mLayers;
    }

    addLayer<T extends SpecType<'layer'>>(id: string, spec: SpecArg<'layer', T>): MassifLayer<ClassOfSpec<'layer', T>> {
        // this.object, not the module-level createLayer: a map-built layer must be released with
        // the map, or a revisited screen fails on a duplicate id
        return this.add(this.object('layer', id, spec) as never) as never;
    }

    /** Owned by the map but not placed: for `add(layer, index)` or `layers().insert(...)`. */
    buildLayer<T extends SpecType<'layer'>>(id: string, spec: SpecArg<'layer', T>): MassifLayer<ClassOfSpec<'layer', T>> {
        const layer = this.object('layer', id, spec) as never as MassifLayer<ClassOfSpec<'layer', T>>;
        layer.map = this;
        return layer;
    }

    add<L extends MassifLayer>(layer: L, index?: number): L {
        const layers = this.layers();
        if (index === undefined) {
            layers.add(layer);
        } else {
            layers.insert(index, layer);
        }
        layer.map = this;
        if (layer.id) {
            this.mLayerById[layer.id] = layer;
        }
        return layer;
    }

    /** The layer stays registered until it is destroyed. */
    removeLayer(layer: MassifLayer | number): boolean {
        if (layer instanceof MassifLayer && layer.id) {
            delete this.mLayerById[layer.id];
        }
        return this.layers().remove(layer);
    }

    /** A layer this map added or adopted, by the id it was given. */
    layer(id: string): MassifLayer | null {
        return this.mLayerById[id] ?? null;
    }

    /** Includes layers the object API put there. */
    layerCount(): number {
        return this.layers().count();
    }

    adopt(id: string, nativeLayer: any, className?: ClassName): MassifLayer {
        const layer = adoptLayer(id, nativeLayer, className);
        layer.map = this;
        this.mLayerById[id] = layer;
        return layer;
    }

    /** OWNED by this map and released with it; module-level `create` is for something shared. */
    object<K extends Kind, T extends SpecType<K>>(kind: K, id: string, spec: SpecArg<K, T>): MassifObject<ClassOfSpec<K, T>>;
    /** @see create - `className` is required, for the same reason. */
    object<C extends ClassName>(kind: string, id: string, spec: { type: string } & { [key: string]: Json }, className: C): MassifObject<C>;
    object(kind: string, id: string, spec: { type: string }, className?: ClassName): MassifObject {
        const built = (create as (k: string, i: string, sp: unknown, c?: ClassName) => MassifObject)(kind, id, spec, className);
        this.mOwned.push([kind, id]);
        return built;
    }

    source<T extends SpecType<'source'>>(id: string, spec: SpecArg<'source', T>): MassifSource<ClassOfSpec<'source', T>> {
        return this.object('source', id, spec) as never;
    }

    /** Worth an id when the app talks to it later: a layer's style property cannot be read back as a handle. */
    style<T extends SpecType<'style'>>(id: string, spec: SpecArg<'style', T>): MassifObject<ClassOfSpec<'style', T>> {
        return this.object('style', id, spec);
    }

    /** `sourceSpec` is for a map not in lon/lat; only the first call uses it. */
    elements(sourceSpec?: SpecArg<'source', 'local'>): MassifElements {
        if (!this.mElements) {
            this.mElements = new MassifElements(this, `${this.id}.elements`, sourceSpec);
        }
        return this.mElements;
    }

    addMarker(spec: SpecArg<'element', 'marker'>) {
        return this.elements().add(spec);
    }

    addPopup(spec: SpecArg<'element', 'balloon'>) {
        return this.elements().add(spec);
    }

    /** Releases every id the map built, not the view: the object API's map keeps working. */
    destroy(): boolean {
        for (let i = this.mOwned.length - 1; i >= 0; i--) {
            destroy(this.mOwned[i][0], this.mOwned[i][1]);
        }
        this.mOwned.length = 0;
        this.mElements = undefined;
        this.mCamera = undefined;
        // A native view's ids are the view's: they are released when it is deleted.
        return this.native ? false : super.destroy();
    }

    size(): { width: number; height: number } {
        return { width: this.view.getMeasuredWidth?.() ?? 0, height: this.view.getMeasuredHeight?.() ?? 0 };
    }

    /** `wait` holds the capture until the tiles have settled. */
    capture(wait = false): Promise<any> {
        if (!this.view.captureRendering) {
            throw new MassifApiError('this map view cannot capture its rendering');
        }
        return this.view.captureRendering(wait);
    }

    /** Rarely needed: the SDK redraws on picture-changing writes. For off-UI-thread changes or a view hidden while moving. */
    requestRedraw(): this {
        this.view.requestRedraw?.();
        return this;
    }

    camera(): MapCamera {
        if (!this.mCamera) {
            // The map view is adopted under its own kind: it is what carries the camera, and
            // going through the facade is also what gives moveTo the map's projection.
            const id = this.native ? this.id : `${this.id}:view`;
            let handle = this.native ? this.native.view : bridge.findObject('view', id);
            if (!handle) {
                handle = bridge.adoptView('view', id, this.view.mapView.getBaseMapView());
                if (!handle) {
                    throw new MassifApiError(`could not register the map view of "${this.id}"`);
                }
                this.mOwned.push(['view', id]);
            }
            const view = new MassifObject(handle as Handle<'massif::BaseMapView'>, 'massif::BaseMapView', id);
            this.mCamera = new MapCamera(view, () => this.size());
        }
        return this.mCamera;
    }

    /** Shorthand for `eventOptions({ projection })`. */
    eventProjection(name: ProjectionName): this {
        return this.eventOptions({ projection: name });
    }

    onClick(handler: (data: MassifEventData<'massif::Options', 'map.clicked'>) => void, options?: SubscribeOptions) {
        return this.subscribe('map.clicked', handler, options);
    }
    onMove(handler: (data: MassifEventData<'massif::Options', 'map.moved'>) => void, options?: SubscribeOptions) {
        return this.subscribe('map.moved', handler, options);
    }
    onIdle(handler: (data: MassifEventData<'massif::Options', 'map.idle'>) => void, options?: SubscribeOptions) {
        return this.subscribe('map.idle', handler, options);
    }
    onStable(handler: (data: MassifEventData<'massif::Options', 'map.stable'>) => void, options?: SubscribeOptions) {
        return this.subscribe('map.stable', handler, options);
    }
    onInteraction(handler: (data: MassifEventData<'massif::Options', 'map.interaction'>) => void, options?: SubscribeOptions) {
        return this.subscribe('map.interaction', handler, options);
    }

    // with a spec these BUILD the options first: Options starts with them empty, and writing
    // through an empty one is an error

    fog(spec?: SpecArg<'options', 'fog'>) {
        return this.optionGroup('fogOptions', 'fog', spec);
    }
    sky(spec?: SpecArg<'options', 'sky'>) {
        return this.optionGroup('skyOptions', 'sky', spec);
    }
    light(spec?: SpecArg<'options', 'light'>) {
        return this.optionGroup('lightOptions', 'light', spec);
    }
    /** The elevation decoder comes from the source's own `encoding`. */
    terrain(spec?: SpecArg<'options', 'terrain'>) {
        return this.optionGroup('terrainOptions', 'terrain', spec);
    }

    private optionGroup<P extends ObjectPath<'massif::Options'>>(property: P, type: SpecType<'options'>, spec?: SpecArg<'options', SpecType<'options'>>) {
        if (spec) {
            const built = this.object('options', `${this.id}.${type}`, spec);
            this.set(property as never, built.handle as never);
        }
        return this.group(property);
    }
}

/** For a loaded map view. Its event listener is CHAINED, not replaced, so existing handlers keep firing. */
export function attach(view: MapViewLike, options: AttachOptions = {}): MassifMap {
    requireApi();
    // the view attaches itself on load; a second registration would leave two handles onto one
    // object, one dangling once the other is destroyed
    const existing = (view as any).facadeMap?.();
    if (existing) {
        const { projection: existingProjection, throttle: existingThrottle, debounce: existingDebounce } = options;
        if (existingProjection || existingThrottle || existingDebounce) {
            existing.eventOptions({ projection: existingProjection, throttle: existingThrottle, debounce: existingDebounce });
            // Re-subscribes the view's own events, which were made before these options existed.
            (view as any).enableFacadeEvents?.();
        }
        return existing;
    }
    if (!view.mapView) {
        throw new MassifApiError('the map is not ready yet - attach from the mapReady event');
    }
    // Android: the native view registered itself, under an id of its own.
    const native = bridge.nativeViewHandles(view.mapView);
    let id = options.id ?? 'map';
    let handle: number;
    if (native) {
        id = native.id;
        handle = native.map;
    } else {
        const nativeOptions = view.getOptions()?.getNative();
        if (!nativeOptions) {
            throw new MassifApiError('the map is not ready yet - attach from the mapReady event');
        }
        handle = bridge.adoptOptions('options', id, nativeOptions);
    }
    if (!handle) {
        throw new MassifApiError(`could not register the map under "${id}" - the id is taken`);
    }
    if (!native) {
        bridge.attachMapEvents(view.mapView, handle);
    }

    const map = new MassifMap(handle as Handle<'massif::Options'>, id, view, native);
    const { projection, throttle, debounce } = options;
    if (projection || throttle || debounce) {
        map.eventOptions({ projection, throttle, debounce });
    }
    return map;
}

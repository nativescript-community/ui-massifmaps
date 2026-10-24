import { Delivery, NativeBridge, NativeEventHandler } from './bridge';

/**
 * Swig-ObjC selectors are the method name then every parameter name after the first:
 * `-setFloat:path:value:` reads here as `setFloatPathValue`.
 */

/** Stands in for a null default. Contains a NUL, so no real value equals it. */
const ABSENT = '\u0000massif:absent';

function lookup(name: string): any {
    try {
        return (global as any)[name] ?? null;
    } catch (e) {
        return null;
    }
}

const MassifApi = lookup('MSFMassifApi');
/** MassifInterop takes SDK types; MassifApi is kept to strings, numbers and handles so a hand-written binding can carry it. */
const MassifInterop = lookup('MSFMassifInterop');

const CAN_CONSUME = typeof MassifApi?.onEventListenerDeliveryCoalesceProjectionConsume === 'function';

/**
 * ObjC shim: the SDK emits from render/tile threads with no JS runtime, so it `dispatch_sync`s
 * onto the main queue - which is how a consuming subscription can still answer synchronously.
 */
const NativeEventListener = lookup('NSMSFApiEventListener');

/** Keeps each director alive: C++ holds a raw pointer and ARC would collect it once `on` returns. */
const listeners = new Map<number, any>();
const eventBridges = new Map();

function toArrayBuffer(data: NSData): ArrayBuffer {
    const buffer = new ArrayBuffer(data.length);
    if (data.length) {
        data.getBytes(buffer as any);
    }
    return buffer;
}

export const bridge: NativeBridge = {
    available: !!MassifApi && !!MassifInterop,

    create: (kind, id, json) => MassifApi.createObjectIdJson(kind, id, json),
    destroy: (handle) => MassifApi.destroy(handle),
    isValid: (handle) => MassifApi.isValid(handle),
    findObject: (kind, id) => MassifApi.findObjectObjectId(kind, id),
    unregisterObject: (kind, id) => MassifApi.unregisterObjectObjectId(kind, id),

    setFloat: (handle, path, value) => MassifApi.setFloatPathValue(handle, path, value),
    setInt: (handle, path, value) => MassifApi.setIntPathValue(handle, path, value),
    setBool: (handle, path, value) => MassifApi.setBoolPathValue(handle, path, value),
    setString: (handle, path, value) => MassifApi.setStringPathValue(handle, path, value),
    setObject: (handle, path, value) => MassifApi.setObjectPathValue(handle, path, value),
    // Only on an SDK that carries it: an older one keeps the per-key path.
    setAll: MassifApi?.setAllJsonProjection ? (handle, json, projection) => MassifApi.setAllJsonProjection(handle, json, projection) : undefined,
    getObject: (handle, path) => MassifApi.getObjectPath(handle, path),

    getFloat: (handle, path, defaultValue) => MassifApi.getFloatPathDefaultValue(handle, path, defaultValue),
    getInt: (handle, path, defaultValue) => MassifApi.getIntPathDefaultValue(handle, path, defaultValue),
    getBool: (handle, path, defaultValue) => MassifApi.getBoolPathDefaultValue(handle, path, defaultValue),
    getString(handle, path) {
        const value = MassifApi.getStringPathDefaultValue(handle, path, ABSENT);
        return value === ABSENT ? null : value;
    },
    getPos(handle, path, projection) {
        const json = MassifApi.getPosPathProjection(handle, path, projection);
        return json ? json : null;
    },

    call: (handle, method, argsJson) => MassifApi.callMethodArgsJson(handle, method, argsJson),
    callAsync: (handle, method, argsJson, event) => MassifApi.callAsyncMethodArgsJsonEvent(handle, method, argsJson, event),
    cancelCall: (call) => MassifApi.cancelCall(call),
    cancelCalls: (handle) => MassifApi.cancelCalls(handle),

    getDoubles(handle) {
        // The module declares an NSData typemap for std::vector<double> - the raw doubles, not
        // the MSFDoubleVector proxy, which would be one call per element.
        const data: NSData = MassifApi.getDoubles(handle);
        if (!data || !data.length) {
            return [];
        }
        const buffer = new ArrayBuffer(data.length);
        data.getBytes(buffer as any);
        return Array.from(new Float64Array(buffer));
    },
    getData(handle, path) {
        // Empty is what a non-blob path returns.
        const data: NSData = MassifApi.getDataPath(handle, path);
        return data && data.length ? toArrayBuffer(data) : null;
    },

    // An ArrayBuffer crosses as the NSData the SDK takes.
    createData: (id, bytes) => MassifApi.createDataBytes(id, bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)) || 0,

    canConsume: CAN_CONSUME,

    on(handle: number, event: string, handler: NativeEventHandler, delivery: Delivery, coalesce: boolean, projection: string, consume: boolean) {
        if (!NativeEventListener) {
            throw new Error('the plugin was built without NSMSFApiEventListener - see the surface API notes in the README');
        }
        const listener = ApiEventListenerImpl.initWithHandler(handler);
        const subscription = CAN_CONSUME
            ? MassifApi.onEventListenerDeliveryCoalesceProjectionConsume(handle, event, listener, delivery, coalesce, projection, consume)
            : MassifApi.onEventListenerDeliveryCoalesceProjection(handle, event, listener, delivery, coalesce, projection);
        if (subscription) {
            listeners.set(subscription, listener);
        }
        return subscription;
    },
    off(subscription) {
        const removed = MassifApi.off(subscription);
        listeners.delete(subscription);
        return removed;
    },
    offAll(handle) {
        return MassifApi.offAll(handle);
    },

    // One selector per `adopt` overload (adopt:objectId:options: etc).
    nativeViewHandles: () => null,
    adoptOptions: (kind, id, options) => MassifInterop.adoptObjectIdOptions(kind, id, options),
    adoptLayer: (kind, id, layer) => MassifInterop.adoptObjectIdLayer(kind, id, layer),
    adoptLayers: (kind, id, layers) => MassifInterop.adoptObjectIdLayers(kind, id, layers),
    adoptSource: (kind, id, source) => MassifInterop.adoptObjectIdSource(kind, id, source),
    adoptView: (kind, id, view) => MassifInterop.adoptObjectIdView(kind, id, view),
    adoptAssets: (kind, id, assets) => MassifInterop.adoptObjectIdAssets(kind, id, assets),
    getNativeLayer: (id) => MassifInterop.getLayer(id),
    getNativeSource: (id) => MassifInterop.getSource(id),
    getNativeLayerByHandle: (handle) => MassifInterop.getLayerByHandle(handle),
    getNativeSourceByHandle: (handle) => MassifInterop.getSourceByHandle(handle),

    attachMapEvents(mapView, handle) {
        const bridgeListener = MassifInterop.createEventBridgeChained(handle, mapView.getMapEventListener());
        eventBridges.set(mapView, bridgeListener);
        mapView.setMapEventListener(bridgeListener);
    },
    attachVectorTileEvents(handle) {
        const layer = MassifInterop.getLayerByHandle(handle);
        if (!layer) {
            return false;
        }
        layer.setVectorTileEventListener(MassifInterop.createVectorTileEventBridgeChained(handle, layer.getVectorTileEventListener()));
        return true;
    },
    attachVectorElementEvents(handle) {
        const layer = MassifInterop.getLayerByHandle(handle);
        if (!layer) {
            return false;
        }
        layer.setVectorElementEventListener(MassifInterop.createVectorElementEventBridgeChained(handle, layer.getVectorElementEventListener()));
        return true;
    },
    attachCelestialEvents(handle) {
        const layer = MassifInterop.getLayerByHandle(handle);
        if (!layer) {
            return false;
        }
        layer.setCelestialEventListener(MassifInterop.createCelestialEventBridgeChained(handle, layer.getCelestialEventListener()));
        return true;
    },

    nativeShortClassName(nativeObject) {
        if (!nativeObject || !nativeObject.class) {
            return null;
        }
        const name = NSStringFromClass(nativeObject.class());
        return name && name.indexOf('MSF') === 0 ? name.substring(3) : null;
    }
};

/**
 * `extend()`, not an ES6 class: without `@NativeClass()` an ES6 class registers no ObjC subclass,
 * so the override falls through to NSMSFApiEventListener's `return NO` and events never arrive.
 */
const ApiEventListenerBase = (NativeEventListener ?? NSObject) as { new (): any; alloc(): any; extend(members: any): any };

const ApiEventListenerClass = ApiEventListenerBase.extend({
    /** `-onEventThreaded:event:payload:` on NSMSFApiEventListener, already on the main queue. */
    onEventThreadedEventPayload(target: number, event: string, payload: number): boolean {
        return this.mHandler ? this.mHandler(target, event, payload) : false;
    }
});

const ApiEventListenerImpl = {
    initWithHandler(handler: NativeEventHandler) {
        const listener = ApiEventListenerClass.alloc().init();
        listener.mHandler = handler;
        return listener;
    }
};

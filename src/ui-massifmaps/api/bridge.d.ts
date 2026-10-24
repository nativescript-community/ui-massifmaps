/**
 * @internal
 * @module
 */
/**
 * Not typed against the SDK typings on purpose: `com.massifmaps.api` / `MSFMassifApi` are not in
 * the generated typings yet and hand declarations would collide once regenerated.
 */

/** Return true to consume the event. */
export type NativeEventHandler = (target: number, event: string, payload: number) => boolean;

/** 0 the producing thread, 1 the UI thread, 2 a background thread. */
export type Delivery = 0 | 1 | 2;

export interface NativeBridge {
    readonly available: boolean;

    create(kind: string, id: string, json: string): number;
    destroy(handle: number): boolean;
    isValid(handle: number): boolean;
    findObject(kind: string, id: string): number;
    unregisterObject(kind: string, id: string): boolean;

    setFloat(handle: number, path: string, value: number): number;
    setInt(handle: number, path: string, value: number): number;
    setBool(handle: number, path: string, value: boolean): number;
    setString(handle: number, path: string, value: string): number;
    setObject(handle: number, path: string, value: number): number;
    /** Undefined on an older SDK; callers then fall back to one call per key (see MassifObject.apply). */
    setAll?(handle: number, json: string, projection: string): number;
    /** Returns a handle the caller owns; 0 when there is none. */
    getObject(handle: number, path: string): number;

    getFloat(handle: number, path: string, defaultValue: number): number;
    getInt(handle: number, path: string, defaultValue: number): number;
    getBool(handle: number, path: string, defaultValue: boolean): boolean;
    /** Null when the path does not resolve. */
    getString(handle: number, path: string): string | null;
    /** Null when the path does not resolve. */
    getPos(handle: number, path: string, projection: string): string | null;

    /** Throws on a stale handle, an unknown method or arguments that do not fit it. */
    call(handle: number, method: string, argsJson: string): number;
    callAsync(handle: number, method: string, argsJson: string, event: string): number;
    cancelCall(call: number): boolean;
    cancelCalls(handle: number): number;

    getDoubles(handle: number): number[];
    /** Null when the path is not a blob. */
    getData(handle: number, path: string): ArrayBuffer | null;
    /** Raw bytes in, copied once with no encoding. 0 when the id is taken or there are no bytes. */
    createData(id: string, bytes: Uint8Array): number;

    /**
     * Keeps the native listener alive: C++ holds it as a raw pointer (iOS ARC would collect it).
     * `consume` must be declared at subscribe time; the SDK ignores a non-consuming handler's return.
     */
    on(handle: number, event: string, handler: NativeEventHandler, delivery: Delivery, coalesce: boolean, projection: string, consume: boolean): number;

    /** False on an SDK whose `on` hardcodes consume; `MassifEventData.consumed` then has no effect. */
    readonly canConsume: boolean;
    off(subscription: number): boolean;
    offAll(handle: number): number;

    /**
     * The handles of the map a native view registered itself (Android). Null where the view's objects are adopted instead.
     */
    nativeViewHandles(mapView: any): { id: string; map: number; view: number; layers: number } | null;

    // One method per adoptable base: `adopt` is overloaded on the C++ type (a distinct ObjC selector
    // / Java overload each). `kind` is the id namespace, never the class.
    adoptOptions(kind: string, id: string, options: any): number;
    adoptLayer(kind: string, id: string, layer: any): number;
    adoptLayers(kind: string, id: string, layers: any): number;
    adoptSource(kind: string, id: string, source: any): number;
    /** The map view carries the camera: moveTo, flyTo, fitBounds... become `call`s on the handle. */
    adoptView(kind: string, id: string, view: any): number;
    /** An app subclasses assets (e.g. to read from the app folder); once adopted, a spec's `assets` key resolves the id. */
    adoptAssets(kind: string, id: string, assets: any): number;
    getNativeLayer(id: string): any;
    getNativeSource(id: string): any;
    /** For an object with no id, e.g. a child read off a property. */
    getNativeLayerByHandle(handle: number): any;
    getNativeSourceByHandle(handle: number): any;

    // Each chains the listener already installed, so existing handlers keep firing.
    attachMapEvents(mapView: any, handle: number): void;
    /** The layer is named by handle, so the native Layer class never has to be reachable from JS. False if it is not a layer of that kind. */
    attachVectorTileEvents(handle: number): boolean;
    attachVectorElementEvents(handle: number): boolean;
    attachCelestialEvents(handle: number): boolean;

    /** Leaf class name, e.g. `com.massifmaps.layers.VectorTileLayer` / `MSFVectorTileLayer` -> `VectorTileLayer`. */
    nativeShortClassName(nativeObject: any): string | null;
}

export declare const bridge: NativeBridge;

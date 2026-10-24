import { Delivery, NativeBridge, NativeEventHandler } from './bridge';

/** Stands in for a null default: Swig's std::string typemap rejects null. Contains a NUL, so no real value equals it. */
const ABSENT = '\u0000massif:absent';

function lookup(): any {
    try {
        return (com as any)?.massifmaps?.api?.MassifApi ?? null;
    } catch (e) {
        return null;
    }
}

/** Only the `objectapi` AAR carries it: it takes SDK types, where MassifApi is kept to strings, numbers and handles. */
function lookupInterop(): any {
    try {
        return (com as any)?.massifmaps?.api?.MassifInterop ?? null;
    } catch (e) {
        return null;
    }
}

/**
 * Java shim: the SDK emits from render/tile threads with no JS runtime, so it hops to the main
 * looper and waits - which is how a consuming subscription can still answer synchronously.
 */
function lookupListener(): any {
    try {
        return (com as any)?.nativescript?.massifmaps?.api?.EventListener ?? null;
    } catch (e) {
        return null;
    }
}

const MassifApi = lookup();
const MassifInterop = lookupInterop();

function legacy(what: string): any {
    if (!MassifInterop) {
        throw new Error(`${what} needs the object API: use the "objectapi" variant of the Massif Maps AAR, or the surface API`);
    }
    return MassifInterop;
}
const NativeEventListener = lookupListener();

/** An SDK whose `on` hardcodes consume has 6 parameters; one taking the consume flag has 7. */
const CAN_CONSUME = (() => {
    try {
        const methods = MassifApi?.class?.getDeclaredMethods() ?? [];
        for (let i = 0; i < methods.length; i++) {
            if (methods[i].getName() === 'on' && methods[i].getParameterTypes().length === 7) {
                return true;
            }
        }
    } catch (e) {
        // A reflection failure is not a reason to fail the subscription.
    }
    return false;
})();

/** Keeps each subscription's director alive; the C++ side holds it as a raw pointer. */
const listeners = new Map<number, any>();

function toArrayBuffer(bytes: androidNative.Array<number>): ArrayBuffer {
    try {
        return (ArrayBuffer as any).from(java.nio.ByteBuffer.wrap(bytes));
    } catch (e) {
        // Older runtimes have no ByteBuffer conversion; copying is slow but never wrong.
        const out = new Int8Array(bytes.length);
        for (let i = 0; i < bytes.length; i++) {
            out[i] = bytes[i];
        }
        return out.buffer;
    }
}

export const bridge: NativeBridge = {
    available: !!MassifApi,

    create: (kind, id, json) => MassifApi.create(kind, id, json),
    destroy: (handle) => MassifApi.destroy(handle),
    isValid: (handle) => MassifApi.isValid(handle),
    findObject: (kind, id) => MassifApi.findObject(kind, id),
    unregisterObject: (kind, id) => MassifApi.unregisterObject(kind, id),

    setFloat: (handle, path, value) => MassifApi.setFloat(handle, path, value),
    setInt: (handle, path, value) => MassifApi.setInt(handle, path, value),
    setBool: (handle, path, value) => MassifApi.setBool(handle, path, value),
    setString: (handle, path, value) => MassifApi.setString(handle, path, value),
    setObject: (handle, path, value) => MassifApi.setObject(handle, path, value),
    // Only on an SDK that carries it: an older one keeps the per-key path.
    setAll: MassifApi?.setAll ? (handle, json, projection) => MassifApi.setAll(handle, json, projection) : undefined,
    getObject: (handle, path) => MassifApi.getObject(handle, path),

    getFloat: (handle, path, defaultValue) => MassifApi.getFloat(handle, path, defaultValue),
    getInt: (handle, path, defaultValue) => MassifApi.getInt(handle, path, defaultValue),
    getBool: (handle, path, defaultValue) => MassifApi.getBool(handle, path, defaultValue),
    getString(handle, path) {
        const value = MassifApi.getString(handle, path, ABSENT);
        return value === ABSENT ? null : value;
    },
    getPos(handle, path, projection) {
        const json = MassifApi.getPos(handle, path, projection);
        return json ? json : null;
    },

    call: (handle, method, argsJson) => MassifApi.call(handle, method, argsJson),
    callAsync: (handle, method, argsJson, event) => MassifApi.callAsync(handle, method, argsJson, event),
    cancelCall: (call) => MassifApi.cancelCall(call),
    cancelCalls: (handle) => MassifApi.cancelCalls(handle),

    getDoubles(handle) {
        const native = MassifApi.getDoubles(handle);
        const out: number[] = new Array(native ? native.length : 0);
        for (let i = 0; i < out.length; i++) {
            out[i] = native[i];
        }
        return out;
    },
    getData(handle, path) {
        // An empty array is what a path that is not a blob returns.
        const data = MassifApi.getData(handle, path);
        return data && data.length ? toArrayBuffer(data) : null;
    },

    // The runtime marshals a typed array into the byte[] the SDK takes.
    createData: (id, bytes) => MassifApi.createData(id, bytes) || 0,

    canConsume: CAN_CONSUME,

    on(handle: number, event: string, handler: NativeEventHandler, delivery: Delivery, coalesce: boolean, projection: string, consume: boolean) {
        if (!NativeEventListener) {
            throw new Error('the plugin was built without com.nativescript.massifmaps.api.EventListener - see the surface API notes in the README');
        }
        const listener = new NativeEventListener(
            new NativeEventListener.Listener({
                onEvent: (target: number, name: string, payload: number) => handler(target, name, payload)
            })
        );
        const subscription = CAN_CONSUME ? MassifApi.on(handle, event, listener, delivery, coalesce, projection, consume) : MassifApi.on(handle, event, listener, delivery, coalesce, projection);
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

    // One overloaded Java method; the runtime picks by the proxy's own class, so each of these
    // has to be handed a concrete native object - never null, which would be ambiguous.
    nativeViewHandles(mapView) {
        const id: string = mapView.getMapId();
        const map = MassifApi.findObject('map', id);
        return map ? { id, map, view: MassifApi.findObject('view', id), layers: MassifApi.findObject('layers', id) } : null;
    },
    adoptOptions: (kind, id, options) => legacy('adopting an options object').adopt(kind, id, options),
    adoptLayer: (kind, id, layer) => legacy('adopting a layer').adopt(kind, id, layer),
    adoptLayers: (kind, id, layers) => legacy('adopting a layer list').adopt(kind, id, layers),
    adoptSource: (kind, id, source) => legacy('adopting a source').adopt(kind, id, source),
    adoptView: (kind, id, view) => legacy('adopting a view').adopt(kind, id, view),
    adoptAssets: (kind, id, assets) => legacy('adopting an asset package').adopt(kind, id, assets),
    getNativeLayer: (id) => legacy('reading a native layer').getLayer(id),
    getNativeSource: (id) => legacy('reading a native source').getSource(id),
    getNativeLayerByHandle: (handle) => legacy('reading a native layer').getLayerByHandle(handle),
    getNativeSourceByHandle: (handle) => legacy('reading a native source').getSourceByHandle(handle),

    attachMapEvents() {
        // The native view installs its event bridge when it is created.
    },
    attachVectorTileEvents: (handle) => MassifApi.attachVectorTileEvents(handle),
    attachVectorElementEvents: (handle) => MassifApi.attachVectorElementEvents(handle),
    attachCelestialEvents: (handle) => MassifApi.attachCelestialEvents(handle),

    nativeShortClassName(nativeObject) {
        if (!nativeObject || typeof nativeObject.getClass !== 'function') {
            return null;
        }
        const name: string = nativeObject.getClass().getName();
        return name.substring(name.lastIndexOf('.') + 1) || null;
    }
};

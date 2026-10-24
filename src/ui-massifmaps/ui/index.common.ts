import { CSSType, ContentView } from '@nativescript/core';
import { BaseNative } from '../BaseNative';
import { LatitudeKey, LongitudeKey, MapPos, fromNativeMapPos } from '../core';
import { Layer } from '../layers';
import { bearingProperty, focusPosProperty, tiltProperty, zoomProperty } from './cssproperties';
import { MapInfo } from '.';
import { attach as attachFacade, isAvailable as isApiAvailable } from '../api';
import { enumValue } from '../api/resolve';

export const MapReadyEvent = 'mapReady';
export const MapStableEvent = 'mapStable';
export const MapIdleEvent = 'mapIdle';
export const MapMovedEvent = 'mapMoved';
export const MapInteractionEvent = 'mapInteraction';
export const MapClickedEvent = 'mapClicked';

/**
 * MapMoveReason.h declaration order. Indexed rather than switched so a reason added later reads
 * as undefined instead of silently becoming 'api'.
 */
const MAP_MOVE_REASONS = ['gesture', 'animation', 'api'] as const;

/** Accepts `MAP_MOVE_REASON_GESTURE` or an index; undefined otherwise (e.g. an older SDK sending no payload). */
export function mapMoveReason(reason: number | string | undefined) {
    if (typeof reason === 'number') {
        return MAP_MOVE_REASONS[reason];
    }
    if (typeof reason === 'string' && reason.startsWith('MAP_MOVE_REASON_')) {
        const short = reason.substring('MAP_MOVE_REASON_'.length).toLowerCase();
        return MAP_MOVE_REASONS.indexOf(short as any) >= 0 ? (short as (typeof MAP_MOVE_REASONS)[number]) : undefined;
    }
    return undefined;
}

export function moveEventData(reason: number | string | undefined) {
    const name = mapMoveReason(reason);
    return { reason: name, userAction: name === 'gesture' };
}

// Explicit rather than derived: the view's names are historical. `mapReady` is the plugin's own.
const FACADE_EVENTS: [string, string][] = [
    [MapMovedEvent, 'map.moved'],
    [MapStableEvent, 'map.stable'],
    [MapIdleEvent, 'map.idle'],
    [MapClickedEvent, 'map.clicked'],
    [MapInteractionEvent, 'map.interaction']
];

/** `'CLICK_TYPE_SINGLE'` back to the number the mapClicked event has always carried. */
function clickTypeValue(name: string): number {
    const value = enumValue(name);
    return value === undefined ? -1 : value;
}

/** Read eagerly: the payload dies when the handler returns, so a lazy getter would read nothing. */
function facadeEventData(viewEvent: string, e: any) {
    // An SDK older than the payload it is described as carrying sends none - reading through
    // would throw, and an exception here crosses a JNI director and aborts the process.
    if (viewEvent !== MapIdleEvent && !e.payload) {
        return viewEvent === MapMovedEvent || viewEvent === MapStableEvent ? moveEventData(undefined) : undefined;
    }
    switch (viewEvent) {
        case MapMovedEvent:
        case MapStableEvent:
            return moveEventData(e.reason);
        case MapInteractionEvent:
            return {
                // The SDK only raises it from the touch pipeline.
                reason: 'gesture',
                userAction: true,
                interaction: {
                    isAnimationStarted: e.animationStarted,
                    isPanAction: e.panAction,
                    isRotateAction: e.rotateAction,
                    isTiltAction: e.tiltAction,
                    isZoomAction: e.zoomAction
                }
            };
        case MapClickedEvent: {
            const at = e.getPos('clickPos');
            return {
                // Mapped back to the numeric ClickType existing handlers compare against.
                clickType: clickTypeValue(e.clickType),
                clickInfo: { duration: e.get('clickInfo.duration') },
                position: at ? ({ [LatitudeKey]: at[1], [LongitudeKey]: at[0] } as any) : null
            };
        }
        default:
            return undefined;
    }
}

export interface MapPropertyOptions {
    converter?: Function;
    defaultValue?: any;
    nativeGetterName?: string;
    getConverter?: Function;
    ios?: {
        nativeGetterName?: string;
        // nativeSetterName?: string;
    };
    android?: {
        nativeGetterName?: string;
        // nativeSetterName?: string;
    };
}

function createGetter(key: string, options: MapPropertyOptions) {
    const nativeGetterName = ((__ANDROID__ ? options.android : options.ios) || options).nativeGetterName || 'get' + key.charAt(0).toUpperCase() + key.slice(1);
    const getConverter = options.getConverter;
    return function () {
        const fromFacade = this.readMapProperty?.(key);
        if (fromFacade !== undefined) {
            return fromFacade;
        }
        let result;
        if (this.nativeViewProtected && this.nativeViewProtected[nativeGetterName]) {
            result = this.nativeViewProtected[nativeGetterName]();
        } else {
            result = this.style[key] || options.defaultValue;
        }
        result = getConverter ? getConverter.call(this, result) : result;
        return result;
    };
}
function createSetter(key, options: MapPropertyOptions) {
    return function (newVal) {
        const actualVal = options.converter ? options.converter(newVal) : newVal;
        this.style[key] = actualVal;
    };
}

function mapPropertyGenerator(target: object, key: string, options?: MapPropertyOptions) {
    Object.defineProperty(target, key, {
        get: createGetter(key, options),
        set: createSetter(key, options),
        enumerable: true,
        configurable: true
    });
}
export function mapProperty(target: any, k?, desc?: PropertyDescriptor): any;
export function mapProperty(options: MapPropertyOptions): (target: any, k?, desc?: PropertyDescriptor) => any;
export function mapProperty(...args) {
    const options = args[0];
    if (args[1] === undefined) {
        return function (target: any, key?: string, descriptor?: PropertyDescriptor) {
            return mapPropertyGenerator(target, key, options);
        };
    } else {
        return mapPropertyGenerator(args[0], args[1], {});
    }
}

export abstract class Layers<T = any> extends BaseNative<T, {}> {
    private readonly mLayerArray: Layer<any, any>[] = [];

    constructor(native) {
        super(null, native);
    }

    abstract count(): number;

    insert(index: number, layer: Layer<any, any>) {
        this.mLayerArray.splice(index, 0, layer);
    }

    //@ts-ignore
    set(index: number, layer: Layer<any, any>) {
        this.mLayerArray[index] = layer;
    }

    removeAll(layers: Layer<any, any>[]): boolean {
        let hasRemovedAll: boolean = true;

        layers.forEach((layer) => {
            if (!this.remove(layer)) {
                if (hasRemovedAll) {
                    hasRemovedAll = false;
                }
            }
        });
        return hasRemovedAll;
    }

    remove(layer: Layer<any, any>): boolean {
        const index = this.mLayerArray.indexOf(layer);
        if (index >= 1) {
            this.mLayerArray.splice(index, 1);
            return true;
        }
        return false;
    }

    add(layer: Layer<any, any>) {
        this.mLayerArray.push(layer);
    }

    addAll(layers: Layer<any, any>[]) {
        layers.forEach((layer) => this.add(layer));
    }
    setAll(layers: Layer<any, any>[]) {
        this.clear();
        this.addAll(layers);
    }

    //@ts-ignore
    abstract get(index: number): Layer<any, any>;
    abstract getAll(): Layer<any, any>[];

    clear() {
        this.mLayerArray.splice(0);
    }

    // public getNative() {
    //     return this.native;
    // }
}

@CSSType('MassifMap')
export abstract class MassifMapViewBase extends ContentView {
    public static mapReadyEvent = MapReadyEvent;
    public static mapStableEvent = MapStableEvent;
    public static mapIdleEvent = MapIdleEvent;
    public static mapMovedEvent = MapMovedEvent;
    public static mapInteractionEvent = MapInteractionEvent;
    public static mapClickedEvent = MapClickedEvent;

    //TODO: remove as it needs to be added after TS 5.7 change https://github.com/microsoft/TypeScript/pull/59860
    [key: symbol]: (...args: any[]) => any | void;

    public mapReady = false;
    nativeProjection: any;
    @mapProperty({
        getConverter: (value) => fromNativeMapPos(value)
    })
    focusPos: MapPos;
    @mapProperty zoom: number;
    @mapProperty({
        ios: {
            nativeGetterName: 'getRotation'
        },
        android: {
            nativeGetterName: 'getMapRotation'
        }
    })
    bearing: number;
    @mapProperty tilt: number;
    @mapProperty minZoom: number;
    @mapProperty maxZoom: number;
    @mapProperty restrictedPanning: boolean;

    private mLayers: Layers;
    private mFacade: any = null;
    private mFacadeSubscriptions: any[] = [];

    /** Per-event subscription options, keyed by the view's event name. */
    eventOptions: { [event: string]: { throttle?: number; debounce?: number; projection?: string } };

    get mapView() {
        return this.nativeViewProtected;
    }

    public sendEvent<T extends MapInfo = MapInfo>(eventName: string, data?: T) {
        this.raise(eventName, data);
    }

    private raise(eventName: string, data?: any) {
        if (this.hasListeners(eventName)) {
            this.notify({
                eventName,
                data
            });
        }
    }

    public onLoaded() {
        super.onLoaded();
        if (!this.mapReady) {
            this.mapReady = true;
            setTimeout(() => {
                this.enableFacadeEvents();
                this.sendEvent(MapReadyEvent);
            }, 0);
        }
    }

    /**
     * Map events come only through the facade, so they need an SDK built with the surface API;
     * without one the map raises no events (and warns once).
     */
    enableFacadeEvents(eventOptions = this.eventOptions) {
        this.eventOptions = eventOptions;
        if (!this.mapView) {
            return;
        }
        if (this.mFacade) {
            // Already attached: re-subscribe so new options apply.
            for (const subscription of this.mFacadeSubscriptions) {
                subscription.remove();
            }
            this.mFacadeSubscriptions = [];
            this.subscribeFacadeEvents();
            return;
        }
        if (!this.ensureFacade()) {
            return;
        }
        this.subscribeFacadeEvents();
    }

    /** Lets `api.attach()` reuse this handle rather than registering the map twice. Null before load. */
    facadeMap() {
        return this.mFacade;
    }

    private ensureFacade(): boolean {
        if (this.mFacade) {
            return true;
        }
        if (!this.mapView) {
            return false;
        }
        if (!isApiAvailable()) {
            console.warn('MassifMap: this MassifMaps build has no surface API, so the map raises no events');
            return false;
        }
        try {
            this.mFacade = attachFacade(this as any, { id: `massif-map-${this._domId}` });
            return true;
        } catch (error) {
            console.warn(`MassifMap: could not attach the map's events - ${error}`);
            return false;
        }
    }

    /** The surface API of this map: its camera, options and layers. Attached on first use, so it works before `mapReady`. */
    get api() {
        if (!this.ensureFacade()) {
            throw new Error('MassifMap: the map has no surface API yet - wait for the mapReady event, and check the AAR has the surface API');
        }
        return this.mFacade;
    }

    private subscribeFacadeEvents() {
        for (const [viewEvent, facadeEvent] of FACADE_EVENTS) {
            this.mFacadeSubscriptions.push(
                this.mFacade.subscribe(facadeEvent as never, (e) => this.raise(viewEvent, facadeEventData(viewEvent, e)), this.eventOptions?.[viewEvent])
            );
        }
    }

    abstract createLayersInstance();

    getLayers(): Layers {
        if (!this.mLayers && this.mapView) {
            this.mLayers = this.createLayersInstance();
        }
        return this.mLayers;
    }

    addLayer(layer: Layer<any, any>, index?: number) {
        const layersInstance = this.getLayers();
        if (layersInstance) {
            if (index !== undefined && index <= layersInstance.count()) {
                layersInstance.insert(index, layer);
            } else {
                layersInstance.add(layer);
            }
        }
    }

    removeLayer(layer: Layer<any, any>) {
        const layersInstance = this.getLayers();
        if (layersInstance) {
            layersInstance.remove(layer);
        }
    }

    removeAllLayers(layers: Layer<any, any>[]) {
        const layersInstance = this.getLayers();
        if (layersInstance) {
            layersInstance.removeAll(layers);
        }
    }

    disposeNativeView() {
        this.mapReady = false;

        for (const subscription of this.mFacadeSubscriptions) {
            subscription.remove();
        }
        this.mFacadeSubscriptions = [];
        if (this.mFacade) {
            this.mFacade.destroy();
            this.mFacade = null;
        }

        if (this.mLayers) {
            this.mLayers.clear();
            this.mLayers = null;
        }

        super.disposeNativeView();
    }

    [focusPosProperty.setNative](value: MapPos) {
        if (!this.nativeViewProtected || !this.nativeProjection) {
            return;
        }
        this.setFocusPos(value, 0);
    }
    [zoomProperty.setNative](value: number) {
        if (!this.nativeViewProtected) {
            return;
        }
        this.setZoom(value, 0);
    }
    [tiltProperty.setNative](value: number) {
        if (!this.nativeViewProtected) {
            return;
        }
        this.setTilt(value, 0);
    }
    [bearingProperty.setNative](value: number) {
        if (!this.nativeViewProtected) {
            return;
        }
        this.setBearing(value, 0);
    }
    abstract setFocusPos(value: MapPos, duration: number);
    abstract setZoom(value: number, targetPos: MapPos | number, duration?: number);
    abstract setBearing(value: number, duration: number);
    abstract setTilt(value: number, duration: number);
    abstract fromNativeMapPos(position: any): MapPos;

    get metersPerPixel(): number {
        if (this.nativeViewProtected) {
            const pos = this.focusPos;
            const zoom = this.zoom;
            return (156543.03390625 * Math.cos((pos[LatitudeKey] * Math.PI) / 180)) / Math.pow(2, zoom);
        }
        return 0;
    }
}

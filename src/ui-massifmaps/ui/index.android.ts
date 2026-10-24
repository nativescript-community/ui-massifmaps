import { FogOptions, LightOptions, MapOptions, SkyOptions, TerrainOptions } from '../components';
import { AltitudeKey, ClickType, DefaultLatLonKeys, LatitudeKey, LongitudeKey, MapBounds, MapPos, ScreenBounds, ScreenPos, fromNativeMapBounds, fromNativeMapPos, fromNativeScreenPos, nativeVectorToArray, toNativeMapBounds, toNativeMapPos, toNativeScreenBounds, toNativeScreenPos } from '../core';
import { Layer, TileLayer } from '../layers';
import { IProjection } from '../projections';
import { restrictedPanningProperty } from './cssproperties';
import { Layers as BaseLayers, MapClickedEvent, MapIdleEvent, MapInteractionEvent, MapMovedEvent, MapReadyEvent, MapStableEvent, MassifMapViewBase, moveEventData } from './index.common';

import { ImageSource, Property, Utils, booleanConverter } from '@nativescript/core';
import { FlyToOptions, MapClickInfo, MapGestureInfo, MapInteractionInfo } from '.';
import { PostProcessEffect } from '../renderers';
import { EPSG4326 } from '../projections/epsg4326';
export { MapClickedEvent, MapIdleEvent, MapMovedEvent, MapReadyEvent, MapStableEvent };

export const RenderProjectionMode = {
    get RENDER_PROJECTION_MODE_PLANAR() {
        return com.massifmaps.components.RenderProjectionMode.RENDER_PROJECTION_MODE_PLANAR;
    },
    get RENDER_PROJECTION_MODE_SPHERICAL() {
        return com.massifmaps.components.RenderProjectionMode.RENDER_PROJECTION_MODE_SPHERICAL;
    }
};
export const PanningMode = {
    get PANNING_MODE_FREE() {
        return com.massifmaps.components.PanningMode.PANNING_MODE_FREE;
    },
    get PANNING_MODE_STICKY() {
        return com.massifmaps.components.PanningMode.PANNING_MODE_STICKY;
    },
    get PANNING_MODE_STICKY_FINAL() {
        return com.massifmaps.components.PanningMode.PANNING_MODE_STICKY_FINAL;
    }
};

/** The object API ships in the `objectapi` AAR only; what needs it says so instead of failing on a missing class. */
function objectApi(what: string): any {
    const interop = (com as any)?.massifmaps?.api?.MassifInterop;
    if (!interop) {
        throw new Error(`${what} needs the object API: use the "objectapi" variant of the Massif Maps AAR, or the surface API (map.api)`);
    }
    return interop;
}

/** The view's positions in the facade's `[lng, lat]`: no SDK class involved, so it works in a surface-only AAR. */
function toFacadePos(position: MapPos<any>): [number, number] | [number, number, number] {
    const altitude = position[AltitudeKey];
    return altitude === undefined ? [position[LongitudeKey], position[LatitudeKey]] : [position[LongitudeKey], position[LatitudeKey], altitude];
}

function fromFacadePos<T = DefaultLatLonKeys>(position: number[]): MapPos<T> {
    const result: any = { [LatitudeKey]: position[1], [LongitudeKey]: position[0] };
    if (position.length > 2) {
        result[AltitudeKey] = position[2];
    }
    return result;
}

export class MassifMap<T = DefaultLatLonKeys> extends MassifMapViewBase {
    public static setRunOnMainThread(value: boolean) {
        com.nativescript.massifmaps.additions.SynchronousHandler.setRunOnMainThread(value);
    }

    public useTextureView: boolean;
    nativeViewProtected: com.massifmaps.ui.MapView;
    mProjection: IProjection;

    override get mapView(): com.massifmaps.ui.MapView {
        return super.mapView;
    }

    // A MapView carries no object API: what still needs one reads it back from the view's handles, in the objectapi AAR.
    // `what` names the caller, so the error says which method needs it.
    private objectApiView(what: string) {
        return this.mapView ? objectApi(what).getViewByHandle(this.mapView.getViewHandle()) : null;
    }
    private objectApiOptions(what: string) {
        return this.mapView ? objectApi(what).getOptionsByHandle(this.mapView.getMapHandle()) : null;
    }
    private objectApiLayers(what: string) {
        return this.mapView ? objectApi(what).getLayerListByHandle(this.mapView.getLayersHandle()) : null;
    }

    private get camera() {
        return this.api.camera();
    }

    /** What `zoom`, `tilt`... read: from the camera, since a native MapView has no getters. */
    readMapProperty(key: string) {
        if (!this.mapView || !this.mapReady) {
            return undefined;
        }
        switch (key) {
            case 'zoom':
                return this.camera.zoom();
            case 'tilt':
                return this.camera.tilt();
            case 'bearing':
                return this.camera.rotation();
            case 'focusPos':
                return fromFacadePos(this.camera.position());
            case 'minZoom':
            case 'maxZoom':
            case 'restrictedPanning':
                return this.api.get(key);
            default:
                return undefined;
        }
    }

    get projection() {
        return this.mProjection;
    }
    set projection(proj: IProjection) {
        this.mProjection = proj;
        if (this.nativeViewProtected && (com as any)?.massifmaps?.api?.MassifInterop) {
            this.objectApiOptions('projection').setBaseProjection(proj ? proj.getNative() : null);
        }
    }
    public createNativeView() {
        let view;
        if (this.useTextureView) {
            view = new com.massifmaps.ui.TextureMapView(this._context, `massif-map-${this._domId}`);
        } else {
            view = new com.massifmaps.ui.MapView(this._context, `massif-map-${this._domId}`);
        }
        return view;
    }

    onLoaded() {
        super.onLoaded();
        if (this.nativeViewProtected) {
            this.nativeViewProtected.onResume();
        }
    }
    onUnloaded() {
        super.onUnloaded();
        if (this.nativeViewProtected) {
            this.nativeViewProtected.onPause();
        }
    }

    mOptions: MapOptions;
    /**
     * Wrapped once and cached: re-wrapping would drop the wrapper's own state (cached
     * TerrainOptions...). Null until the map is ready.
     */
    getOptions() {
        if (!this.mapReady) {
            return null;
        }
        const native = this.objectApiOptions('getOptions');
        if (this.mOptions?.getNative() !== native) {
            this.mOptions = new MapOptions(undefined, native);
        }
        return this.mOptions;
    }

    getTerrainOptions() {
        return this.getOptions()?.getTerrainOptions() ?? null;
    }
    setTerrainOptions(terrain: TerrainOptions) {
        this.getOptions()?.setTerrainOptions(terrain);
    }
    getSkyOptions() {
        return this.getOptions()?.getSkyOptions() ?? null;
    }
    setSkyOptions(skyOptions: SkyOptions) {
        this.getOptions()?.setSkyOptions(skyOptions);
    }
    getLightOptions() {
        return this.getOptions()?.getLightOptions() ?? null;
    }
    setLightOptions(lightOptions: LightOptions) {
        this.getOptions()?.setLightOptions(lightOptions);
    }
    getFogOptions() {
        return this.getOptions()?.getFogOptions() ?? null;
    }
    setFogOptions(fogOptions: FogOptions) {
        this.getOptions()?.setFogOptions(fogOptions);
    }
    mPostProcessEffect: PostProcessEffect;
    getPostProcessEffect() {
        const native = this.objectApiView('getPostProcessEffect')?.getMapRenderer().getPostProcessEffect();
        if (!native) {
            return null;
        }
        if (this.mPostProcessEffect?.getNative() !== native) {
            this.mPostProcessEffect = new PostProcessEffect(undefined, native);
        }
        return this.mPostProcessEffect;
    }
    setPostProcessEffect(effect: PostProcessEffect) {
        this.mPostProcessEffect = effect;
        this.objectApiView('setPostProcessEffect')?.getMapRenderer().setPostProcessEffect(effect?.getNative() ?? null);
    }

    flyTo(position: MapPos, options: FlyToOptions = {}) {
        const { bearing, climbHeight = 0, duration = 0, tilt, zoom } = options;
        this.camera.moveTo(toFacadePos(position), { zoom, rotation: bearing, tilt, climbHeight, duration });
    }
    getFlightProgress() {
        return this.camera.progress();
    }
    isFlightActive() {
        return this.camera.isMoving();
    }
    stopFlight() {
        this.camera.stop();
    }
    initNativeView(): void {
        super.initNativeView();
        if (!this.projection && (com as any)?.massifmaps?.api?.MassifInterop) {
            this.projection = new EPSG4326();
        }
    }

    disposeNativeView(): void {
        const view = this.nativeViewProtected;
        this.mProjection = null;
        this.nativeProjection = null;
        this.nativeView.owner = null;
        super.disposeNativeView();
        // The native map and its ids belong to the view: they are released here, not on collection.
        // `delete` is filtered out of the typings with the proxies' own.
        (view as unknown as { delete(): void })?.delete();
    }

    fromNativeMapPos(position: com.massifmaps.core.MapPos) {
        return fromNativeMapPos(position);
    }
    fromNativeMapBounds(position: com.massifmaps.core.MapBounds) {
        return fromNativeMapBounds(new com.massifmaps.core.MapBounds(position.getMin(), position.getMax()));
    }
    toNativeMapPos(position: MapPos) {
        return toNativeMapPos(position);
    }
    toNativeMapBounds(position: MapBounds<T>) {
        return toNativeMapBounds(position);
    }

    setFocusPos(value: MapPos, duration: number = 0) {
        this.camera.animate(duration).position(toFacadePos(value));
    }

    getFocusPos() {
        return fromFacadePos<T>(this.camera.position());
    }
    getMapBounds() {
        const min = this.camera.screenToMap(this.getMeasuredWidth(), 0);
        const max = this.camera.screenToMap(0, this.getMeasuredHeight());
        return new MapBounds<T>(fromFacadePos<T>(min), fromFacadePos<T>(max));
    }

    setMapRotation(value: number, targetPos: MapPos | number, duration: number = 0) {
        if (typeof targetPos === 'number') {
            this.camera.animate(targetPos).rotation(value);
        } else {
            this.camera.animate(duration).moveTo(toFacadePos(targetPos), { rotation: value });
        }
    }
    getZoom() {
        return this.camera.zoom();
    }
    setZoom(value: number, targetPos: MapPos | number, duration: number = 0) {
        if (typeof targetPos === 'number') {
            this.camera.animate(targetPos).zoom(value);
        } else {
            this.camera.animate(duration).zoom(value, toFacadePos(targetPos));
        }
    }
    setTilt(value: number, duration: number = 0) {
        this.camera.animate(duration).tilt(value);
    }
    setBearing(value: number, duration: number = 0) {
        this.camera.animate(duration).rotation(value);
    }
    moveToFitBounds(mapBounds: MapBounds<T>, screenBounds: ScreenBounds, integerZoom: boolean, resetRotation: boolean, resetTilt: boolean, durationSeconds: number) {
        this.camera.fitBounds([toFacadePos(mapBounds.southwest), toFacadePos(mapBounds.northeast)], {
            screen: screenBounds,
            integerZoom,
            resetRotation,
            resetTilt,
            duration: durationSeconds * 1000
        });
    }
    [restrictedPanningProperty.setNative](value: boolean) {
        if (!this.nativeViewProtected) {
            return;
        }
        this.api.set('restrictedPanning', value);
    }

    createLayersInstance(): Layers {
        return new Layers(this.objectApiLayers('getLayers'));
    }

    clearAllCaches() {
        this.mapView && this.mapView.clearAllCaches();
    }
    clearPreloadingCaches() {
        this.mapView && this.mapView.clearPreloadingCaches();
    }
    requestRedraw() {
        this.mapView?.requestRender();
    }
    cancelAllTasks() {
        this.mapView && this.mapView.cancelAllTasks();
    }
    screenToMap(pos: ScreenPos) {
        return this.mapView ? fromFacadePos<T>(this.camera.screenToMap(pos.x, pos.y)) : null;
    }
    mapToScreen(pos: MapPos) {
        return this.mapView ? this.camera.mapToScreen(toFacadePos(pos)) : null;
    }

    /** Through the surface API, so it works without the object API. */
    async captureRendering(wait = false) {
        const png = await this.api.capturePng(wait);
        return png ? ImageSource.fromData(png) : null;
    }
}

export const useTextureViewProperty = new Property<MassifMap, boolean>({
    defaultValue: false,
    name: 'useTextureView',
    valueConverter: booleanConverter
});
useTextureViewProperty.register(MassifMap);

export class Layers extends BaseLayers<com.massifmaps.components.Layers> {
    count() {
        return this.native.count();
    }
    insert(index: number, layer: Layer<any, any>) {
        super.insert(index, layer);
        this.native.insert(index, layer.getNative());
    }
    //@ts-ignore
    set(index: number, layer: Layer<any, any>) {
        super.set(index, layer);
        this.native.set(index, layer.getNative());
    }
    remove(layer: Layer<any, any>) {
        const removed = this.native.remove(layer.getNative());
        if (removed) {
            super.remove(layer);
        }
        return removed;
    }
    add(layer: Layer<any, any>) {
        super.add(layer);
        this.native.add(layer.getNative());
    }
    //@ts-ignore
    get(index: number) {
        return this.native.get(index);
    }
    getAll() {
        return nativeVectorToArray(this.native.getAll());
    }
    clear() {
        super.clear();
        this.native.clear();
    }

    // public getNative() {
    //     return this.native;
    // }
}

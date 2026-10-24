import { FogOptions, LightOptions, MapOptions, SkyOptions, TerrainOptions } from '../components';
import {
    ClickType,
    DefaultLatLonKeys,
    MapBounds,
    MapPos,
    ScreenBounds,
    ScreenPos,
    fromNativeMapBounds,
    fromNativeMapPos,
    fromNativeScreenPos,
    nativeVectorToArray,
    toNativeMapBounds,
    toNativeMapPos,
    toNativeScreenBounds,
    toNativeScreenPos
} from '../core';
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

    // A MapView carries no object API: the camera, the options and the layers are read back from its handles.
    private get nativeBaseView() {
        return this.mapView ? com.massifmaps.api.MassifInterop.getViewByHandle(this.mapView.getViewHandle()) : null;
    }
    private get nativeOptions() {
        return this.mapView ? com.massifmaps.api.MassifInterop.getOptionsByHandle(this.mapView.getMapHandle()) : null;
    }
    private get nativeLayers() {
        return this.mapView ? com.massifmaps.api.MassifInterop.getLayerListByHandle(this.mapView.getLayersHandle()) : null;
    }

    get projection() {
        return this.mProjection;
    }
    set projection(proj: IProjection) {
        this.mProjection = proj;
        if (this.nativeViewProtected) {
            this.nativeOptions.setBaseProjection(proj ? proj.getNative() : null);
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
        const native = this.nativeOptions;
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
        const native = this.nativeBaseView?.getMapRenderer().getPostProcessEffect();
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
        this.nativeBaseView?.getMapRenderer().setPostProcessEffect(effect?.getNative() ?? null);
    }

    flyTo(position: MapPos, options: FlyToOptions = {}) {
        const { bearing = this.nativeBaseView.getRotation(), climbHeight = 0, duration = 0, tilt = this.nativeBaseView.getTilt(), zoom = this.nativeBaseView.getZoom() } = options;
        this.nativeBaseView.flyTo(toNativeMapPos(position), zoom, bearing, tilt, climbHeight, duration / 1000);
    }
    getFlightProgress() {
        return this.nativeBaseView.getFlightProgress();
    }
    isFlightActive() {
        return this.nativeBaseView.isFlightActive();
    }
    stopFlight() {
        this.nativeBaseView.stopFlight();
    }
    initNativeView(): void {
        super.initNativeView();
        if (!this.projection) {
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
        this.nativeBaseView.setFocusPos(toNativeMapPos(value), duration / 1000);
    }

    getFocusPos() {
        return fromNativeMapPos<T>(this.nativeBaseView.getFocusPos());
    }
    getMapBounds() {
        const screenBounds = toNativeScreenBounds({ min: { x: this.getMeasuredWidth(), y: 0 }, max: { x: 0, y: this.getMeasuredHeight() } }) as com.massifmaps.core.ScreenBounds;
        return new MapBounds<T>(fromNativeMapPos(this.nativeBaseView.screenToMap(screenBounds.getMin())), fromNativeMapPos(this.nativeBaseView.screenToMap(screenBounds.getMax())));
    }

    setMapRotation(value: number, targetPos: MapPos | number, duration: number = 0) {
        if (typeof targetPos === 'number') {
            this.nativeBaseView.setRotation(value, targetPos / 1000);
        } else {
            this.nativeBaseView.setRotation(value, toNativeMapPos(targetPos), duration / 1000);
        }
    }
    getZoom() {
        return this.nativeBaseView.getZoom();
    }
    setZoom(value: number, targetPos: MapPos | number, duration: number = 0) {
        if (typeof targetPos === 'number') {
            this.nativeBaseView.setZoom(value, targetPos / 1000);
        } else {
            this.nativeBaseView.setZoom(value, toNativeMapPos(targetPos), duration / 1000);
        }
    }
    setTilt(value: number, duration: number = 0) {
        this.nativeBaseView.setTilt(value, duration / 1000);
    }
    setBearing(value: number, duration: number = 0) {
        this.nativeBaseView.setRotation(value, duration / 1000);
    }
    moveToFitBounds(mapBounds: MapBounds<T>, screenBounds: ScreenBounds, integerZoom: boolean, resetRotation: boolean, resetTilt: boolean, durationSeconds: number) {
        if (!screenBounds) {
            screenBounds = { min: { x: 0, y: 0 }, max: { x: this.getMeasuredWidth(), y: this.getMeasuredHeight() } };
        }
        this.nativeBaseView.moveToFitBounds(this.toNativeMapBounds(mapBounds), toNativeScreenBounds(screenBounds), integerZoom, resetRotation, resetTilt, durationSeconds / 1000);
    }
    [restrictedPanningProperty.setNative](value: boolean) {
        if (!this.nativeViewProtected) {
            return;
        }
        this.nativeOptions.setRestrictedPanning(value);
    }

    createLayersInstance(): Layers {
        return new Layers(this.nativeLayers);
    }

    clearAllCaches() {
        this.mapView && this.mapView.clearAllCaches();
    }
    clearPreloadingCaches() {
        this.mapView && this.mapView.clearPreloadingCaches();
    }
    requestRedraw() {
        this.mapView && this.nativeBaseView.getMapRenderer().requestRedraw();
    }
    cancelAllTasks() {
        this.mapView && this.mapView.cancelAllTasks();
    }
    screenToMap(pos: ScreenPos) {
        if (this.mapView) {
            if (pos instanceof com.massifmaps.core.ScreenPos) {
                return this.fromNativeMapPos(this.nativeBaseView.screenToMap(pos));
            }
            return this.fromNativeMapPos(this.nativeBaseView.screenToMap(toNativeScreenPos(pos)));
        }
        return null;
    }
    mapToScreen(pos: MapPos | com.massifmaps.core.MapPos) {
        if (this.mapView) {
            if (pos instanceof com.massifmaps.core.MapPos) {
                return fromNativeScreenPos(this.nativeBaseView.mapToScreen(pos));
            }
            return fromNativeScreenPos(this.nativeBaseView.mapToScreen(toNativeMapPos(pos)));
        }
        return null;
    }

    captureRendering(wait = false) {
        return new Promise((resolve) => {
            this.nativeBaseView.getMapRenderer().captureRendering(
                new com.nativescript.massifmaps.additions.RendererCaptureListener(
                    new com.nativescript.massifmaps.additions.RendererCaptureListener.Listener({
                        onMapRendered(bitmap: com.massifmaps.graphics.Bitmap) {
                            resolve(new ImageSource(com.massifmaps.utils.BitmapUtils.createAndroidBitmapFromBitmap(bitmap)));
                        }
                    })
                ),
                wait
            );
        });
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

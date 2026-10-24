// GENERATED FILE - do not edit by hand.
// Regenerate with `npm run bindings`.

/** com.massifmaps.datasources.ContourTileDataSource / MSFContourTileDataSource */
export const METHODS = ['clearIntervalMultipliers', 'clearResolutionsForZoom', 'getBaseInterval', 'getDataExtent', 'getIntervalMultiplier', 'getLabelInterval', 'getLayerName', 'getMaxZoom', 'getMinVisibleZoom', 'getMinZoom', 'getResolution', 'getResolutionForZoom', 'getSimplifyTolerance', 'getTerrainOptions', 'isLabelStubsEnabled', 'isSeamlessEdgesEnabled', 'loadTile', 'setBaseInterval', 'setIntervalMultiplier', 'setLabelInterval', 'setLabelStubsEnabled', 'setLayerName', 'setMinVisibleZoom', 'setResolution', 'setResolutionForZoom', 'setSeamlessEdgesEnabled', 'setSimplifyTolerance', 'setTerrainOptions'] as const;

/** the forwarders METHODS installs, so they are visible to TypeScript */
export interface Methods {
    clearIntervalMultipliers(): void;
    clearResolutionsForZoom(): void;
    getBaseInterval(): number;
    getDataExtent(): any;
    getIntervalMultiplier(arg0: number): number;
    getLabelInterval(): number;
    getLayerName(): string;
    getMaxZoom(): number;
    getMinVisibleZoom(): number;
    getMinZoom(): number;
    getResolution(): number;
    getResolutionForZoom(arg0: number): number;
    getSimplifyTolerance(): number;
    getTerrainOptions(): any;
    isLabelStubsEnabled(): boolean;
    isSeamlessEdgesEnabled(): boolean;
    loadTile(arg0: any): any;
    setBaseInterval(arg0: number): void;
    setIntervalMultiplier(arg0: number, arg1: number): void;
    setLabelInterval(arg0: number): void;
    setLabelStubsEnabled(arg0: boolean): void;
    setLayerName(arg0: string): void;
    setMinVisibleZoom(arg0: number): void;
    setResolution(arg0: number): void;
    setResolutionForZoom(arg0: number, arg1: number): void;
    setSeamlessEdgesEnabled(arg0: boolean): void;
    setSimplifyTolerance(arg0: number): void;
    setTerrainOptions(arg0: any): void;
}

export const ACCESSORS: Record<string, [string, string]> = {
    baseInterval: ['getBaseInterval', 'setBaseInterval'],
    labelInterval: ['getLabelInterval', 'setLabelInterval'],
    labelStubsEnabled: ['isLabelStubsEnabled', 'setLabelStubsEnabled'],
    layerName: ['getLayerName', 'setLayerName'],
    minVisibleZoom: ['getMinVisibleZoom', 'setMinVisibleZoom'],
    resolution: ['getResolution', 'setResolution'],
    seamlessEdgesEnabled: ['isSeamlessEdgesEnabled', 'setSeamlessEdgesEnabled'],
    simplifyTolerance: ['getSimplifyTolerance', 'setSimplifyTolerance'],
    terrainOptions: ['getTerrainOptions', 'setTerrainOptions'],
};

/** public shape of the accessors this class declares itself */
export interface Accessors {
    baseInterval: number;
    labelInterval: number;
    labelStubsEnabled: boolean;
    layerName: string;
    minVisibleZoom: number;
    resolution: number;
    seamlessEdgesEnabled: boolean;
    simplifyTolerance: number;
    terrainOptions: any;  // com.massifmaps.components.TerrainOptions
}

/** properties needing a converter, and which one */
export const CONVERTERS = [] as const;

/** ObjC concatenates selector parts, so these names differ on iOS */
export const SELECTORS: Record<string, string> = {
    setIntervalMultiplier: 'setIntervalMultiplierMultiplier',
    setResolutionForZoom: 'setResolutionForZoomResolution',
};

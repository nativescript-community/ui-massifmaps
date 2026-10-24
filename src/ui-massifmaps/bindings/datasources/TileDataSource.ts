// GENERATED FILE - do not edit by hand.
// Regenerate with `npm run bindings`.

/** com.massifmaps.datasources.TileDataSource / MSFTileDataSource */
export const METHODS = ['buildTagValues', 'getDataExtent', 'getMaxOverzoomLevel', 'getMaxZoom', 'getMaxZoomWithOverzoom', 'getMetaData', 'getMinZoom', 'getProjection', 'isMaxOverzoomLevelSet', 'loadTile', 'notifyTilesChanged', 'setMaxOverzoomLevel'] as const;

/** the forwarders METHODS installs, so they are visible to TypeScript */
export interface Methods {
    buildTagValues(arg0: any): any;
    getDataExtent(): any;
    getMaxOverzoomLevel(): number;
    getMaxZoom(): number;
    getMaxZoomWithOverzoom(): number;
    getMetaData(): any;
    getMinZoom(): number;
    getProjection(): any;
    isMaxOverzoomLevelSet(): boolean;
    loadTile(arg0: any): any;
    notifyTilesChanged(arg0: boolean): void;
    setMaxOverzoomLevel(arg0: number): void;
}

export const ACCESSORS: Record<string, [string, string]> = {
    maxOverzoomLevel: ['getMaxOverzoomLevel', 'setMaxOverzoomLevel'],
};

/** public shape of the accessors this class declares itself */
export interface Accessors {
    maxOverzoomLevel: number;
}

/** properties needing a converter, and which one */
export const CONVERTERS = [] as const;

export const SELECTORS: Record<string, string> = {};

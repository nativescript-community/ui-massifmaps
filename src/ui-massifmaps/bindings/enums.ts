// GENERATED FILE - do not edit by hand.
// Regenerate with `npm run bindings`.

/**
 * An enum value, or the raw number it actually is at runtime.
 *
 * `E | number` cannot be written directly - TypeScript reduces it back to `number` and the
 * enum stops being suggested. `number & {}` is what keeps the union alive.
 */
export type EnumValue<E> = E | (number & {});

/** com.massifmaps.styles.AnimationType / MSFAnimationType */
export enum AnimationType {
    ANIMATION_TYPE_NONE = 0,
    ANIMATION_TYPE_STEP = 1,
    ANIMATION_TYPE_LINEAR = 2,
    ANIMATION_TYPE_SMOOTHSTEP = 3,
    ANIMATION_TYPE_SPRING = 4
}

/** com.massifmaps.layers.ClusterBuilderMode / MSFClusterBuilderMode */
export enum ClusterBuilderMode {
    CLUSTER_BUILDER_MODE_ELEMENTS = 0,
    CLUSTER_BUILDER_MODE_ELEMENT_COUNT = 1
}

/** com.massifmaps.graphics.ColorFormat / MSFColorFormat */
export enum ColorFormat {
    COLOR_FORMAT_UNSUPPORTED = 0,
    COLOR_FORMAT_GRAYSCALE = 6409,
    COLOR_FORMAT_GRAYSCALE_ALPHA = 6410,
    COLOR_FORMAT_RGB = 6407,
    COLOR_FORMAT_RGBA = 6408,
    COLOR_FORMAT_BGRA = 1,
    COLOR_FORMAT_RGBA_4444 = 2,
    COLOR_FORMAT_RGB_565 = 3
}

/** com.massifmaps.layers.CompositeSourceType / MSFCompositeSourceType */
export enum CompositeSourceType {
    COMPOSITE_SOURCE_TYPE_RASTER = 0,
    COMPOSITE_SOURCE_TYPE_HILLSHADE = 1,
    COMPOSITE_SOURCE_TYPE_VECTOR = 2
}

/** com.massifmaps.ui.FlightEasing / MSFFlightEasing */
export enum FlightEasing {
    FLIGHT_EASING_EASE = 0,
    FLIGHT_EASING_LINEAR = 1,
    FLIGHT_EASING_EASE_IN = 2,
    FLIGHT_EASING_EASE_OUT = 3,
    FLIGHT_EASING_EASE_IN_OUT = 4
}

/** com.massifmaps.components.FreeRoamMode / MSFFreeRoamMode */
export enum FreeRoamMode {
    FREE_ROAM_MODE_OFF = 0,
    FREE_ROAM_MODE_LOOK = 1,
    FREE_ROAM_MODE_FIRST_PERSON = 2
}

/** com.massifmaps.geometry.GeometryType / MSFGeometryType */
export enum GeometryType {
    GEOMETRY_TYPE_POINT = 0,
    GEOMETRY_TYPE_LINE = 1,
    GEOMETRY_TYPE_POLYGON = 2,
    GEOMETRY_TYPE_MULTIPOINT = 3,
    GEOMETRY_TYPE_MULTILINE = 4,
    GEOMETRY_TYPE_MULTIPOLYGON = 5,
    GEOMETRY_TYPE_COLLECTION = 6
}

/** com.massifmaps.styles.LineJoinType / MSFLineJoinType */
export enum LineJoinType {
    LINE_JOIN_TYPE_NONE = 0,
    LINE_JOIN_TYPE_MITER = 1,
    LINE_JOIN_TYPE_BEVEL = 2,
    LINE_JOIN_TYPE_ROUND = 3
}

/** com.massifmaps.datasources.LocalSpatialIndexType / MSFLocalSpatialIndexType */
export enum LocalSpatialIndexType {
    LOCAL_SPATIAL_INDEX_TYPE_NULL = 0,
    LOCAL_SPATIAL_INDEX_TYPE_KDTREE = 1
}

/** com.massifmaps.ui.MapMoveReason / MSFMapMoveReason */
export enum MapMoveReason {
    MAP_MOVE_REASON_GESTURE = 0,
    MAP_MOVE_REASON_ANIMATION = 1,
    MAP_MOVE_REASON_API = 2
}

/** com.massifmaps.packagemanager.PackageAction / MSFPackageAction */
export enum PackageAction {
    PACKAGE_ACTION_READY = 0,
    PACKAGE_ACTION_WAITING = 1,
    PACKAGE_ACTION_DOWNLOADING = 2,
    PACKAGE_ACTION_COPYING = 3,
    PACKAGE_ACTION_REMOVING = 4
}

/** com.massifmaps.packagemanager.PackageErrorType / MSFPackageErrorType */
export enum PackageErrorType {
    PACKAGE_ERROR_TYPE_SYSTEM = 0,
    PACKAGE_ERROR_TYPE_CONNECTION = 1,
    PACKAGE_ERROR_TYPE_DOWNLOAD_LIMIT_EXCEEDED = 2,
    PACKAGE_ERROR_TYPE_PACKAGE_TOO_BIG = 3,
    PACKAGE_ERROR_TYPE_NO_OFFLINE_PLAN = 4
}

/** com.massifmaps.packagemanager.PackageTileStatus / MSFPackageTileStatus */
export enum PackageTileStatus {
    PACKAGE_TILE_STATUS_MISSING = 0,
    PACKAGE_TILE_STATUS_PARTIAL = 1,
    PACKAGE_TILE_STATUS_FULL = 2
}

/** com.massifmaps.packagemanager.PackageType / MSFPackageType */
export enum PackageType {
    PACKAGE_TYPE_MAP = 0,
    PACKAGE_TYPE_ROUTING = 1,
    PACKAGE_TYPE_GEOCODING = 2,
    PACKAGE_TYPE_VALHALLA_ROUTING = 3
}

/** com.massifmaps.components.PanningSpeedMode / MSFPanningSpeedMode */
export enum PanningSpeedMode {
    PANNING_SPEED_MODE_MAP = 0,
    PANNING_SPEED_MODE_ANCHORED = 1,
    PANNING_SPEED_MODE_CONSTANT = 2
}

/** com.massifmaps.components.PivotMode / MSFPivotMode */
export enum PivotMode {
    PIVOT_MODE_TOUCHPOINT = 0,
    PIVOT_MODE_CENTERPOINT = 1
}

/** com.massifmaps.routing.RouteMatchingPointType / MSFRouteMatchingPointType */
export enum RouteMatchingPointType {
    ROUTE_MATCHING_POINT_UNMATCHED = 0,
    ROUTE_MATCHING_POINT_INTERPOLATED = 1,
    ROUTE_MATCHING_POINT_MATCHED = 2
}

/** com.massifmaps.components.SkyQuality / MSFSkyQuality */
export enum SkyQuality {
    SKY_QUALITY_LOW = 0,
    SKY_QUALITY_MEDIUM = 1,
    SKY_QUALITY_HIGH = 2
}

/** com.massifmaps.components.SkyType / MSFSkyType */
export enum SkyType {
    SKY_TYPE_GRADIENT = 0,
    SKY_TYPE_ATMOSPHERE = 1
}

/** com.massifmaps.components.TerrainFlattenMode / MSFTerrainFlattenMode */
export enum TerrainFlattenMode {
    TERRAIN_FLATTEN_MODE_RENDER = 0,
    TERRAIN_FLATTEN_MODE_FULL = 1
}

/** com.massifmaps.vectortiles.TileFormat / MSFTileFormat */
export enum TileFormat {
    TILE_FORMAT_AUTO = 0,
    TILE_FORMAT_MVT = 1,
    TILE_FORMAT_MLT = 2
}

/** com.massifmaps.components.TileLODProfile / MSFTileLODProfile */
export enum TileLODProfile {
    TILE_LOD_PROFILE_REFERENCE = 0,
    TILE_LOD_PROFILE_MOBILE = 1,
    TILE_LOD_PROFILE_DESKTOP = 2
}

/** com.massifmaps.core.VariantType / MSFVariantType */
export enum VariantType {
    VARIANT_TYPE_NULL = 0,
    VARIANT_TYPE_STRING = 1,
    VARIANT_TYPE_BOOL = 2,
    VARIANT_TYPE_INTEGER = 3,
    VARIANT_TYPE_DOUBLE = 4,
    VARIANT_TYPE_ARRAY = 5,
    VARIANT_TYPE_OBJECT = 6
}

/** com.massifmaps.ui.VectorElementDragMode / MSFVectorElementDragMode */
export enum VectorElementDragMode {
    VECTOR_ELEMENT_DRAG_MODE_VERTEX = 0,
    VECTOR_ELEMENT_DRAG_MODE_ELEMENT = 1
}

/** com.massifmaps.layers.VectorElementDragPointStyle / MSFVectorElementDragPointStyle */
export enum VectorElementDragPointStyle {
    VECTOR_ELEMENT_DRAG_POINT_STYLE_NORMAL = 0,
    VECTOR_ELEMENT_DRAG_POINT_STYLE_VIRTUAL = 1,
    VECTOR_ELEMENT_DRAG_POINT_STYLE_SELECTED = 2
}

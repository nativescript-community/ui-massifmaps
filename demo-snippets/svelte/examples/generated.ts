// GENERATED FILE - do not edit by hand.
// Regenerate with `npm run examples` (scripts/examples), which reads the SDK's
// docs/examples/examples.json - the same manifest the Android gallery and the
// website build from, so the three cannot drift.

export interface ExampleEntry {
    id: string;
    title: string;
    description: string;
    /**
     * The screenshot, as a URL into the SDK repo, or null when the example has none.
     *
     * LINKED rather than bundled: a NativeScript <image src> takes a URL, so the grid
     * needs no asset rule in the host app's bundler, the package carries no megabytes
     * of PNG, and a recaptured screenshot needs no resync. The cost is that the grid
     * wants the network the first time it is opened.
     */
    image: string | null;
    /** Loaded on demand: opening the gallery must not evaluate every example. */
    readonly component: any;
}

export interface ExampleSection {
    id: string;
    title: string;
    description: string;
    examples: ExampleEntry[];
}

function entry(id: string, title: string, description: string, image: string | null, load: () => any): ExampleEntry {
    return {
        id,
        title,
        description,
        image,
        get component() {
            return load().default;
        }
    };
}

export const exampleSections: ExampleSection[] = [
    {
        id: "basics",
        title: "Map basics",
        description: "Put a map on screen and point it somewhere.",
        examples: [
            entry("display-a-map", "Display a map", "One vector layer from one spec - the source, and the Massif streets style over it - and a camera pointed at it.", "https://raw.githubusercontent.com/massif-maps/MassifMaps/master/docs/examples/screenshots/display-a-map.png", () => require('./DisplayAMap.svelte')),
        ]
    },
    {
        id: "camera",
        title: "Camera",
        description: "Move, fly, frame and constrain the view.",
        examples: [
            entry("fly-to", "Fly to a location", "One flight moves position, zoom, rotation and tilt together. Four separate setters would animate independently and visibly fight.", "https://raw.githubusercontent.com/massif-maps/MassifMaps/master/docs/examples/screenshots/fly-to.png", () => require('./FlyTo.svelte')),
        ]
    },
    {
        id: "sources",
        title: "Sources & data",
        description: "Where tiles and features come from.",
        examples: [
            entry("geojson-line", "Add a GeoJSON line", "A \"geojson\" source re-tiles the document on the fly, so the features are styled with CartoCSS and drawn by the same renderer as a tile server's.", "https://raw.githubusercontent.com/massif-maps/MassifMaps/master/docs/examples/screenshots/geojson-line.png", () => require('./GeojsonLine.svelte')),
        ]
    },
    {
        id: "styles",
        title: "Styles & layers",
        description: "CartoCSS, style projects and layer composition.",
        examples: [
            entry("massif-variants", "The Massif styles", "Streets, outdoor, topo, hybrid and e-ink are ONE CartoCSS project: the variant is a style parameter, so switching loads nothing - `params.variant`. Relief and contours are slots of every variant, filled here for outdoor and topo.", "https://raw.githubusercontent.com/massif-maps/MassifMaps/master/docs/examples/screenshots/massif-variants.png", () => require('./MassifVariants.svelte')),
            entry("style-parameters", "Change a style at runtime", "A style project declares `param::` values the app sets while the map runs, as properties: `params.<name>`. A value swaps live; one used in a filter re-decodes the tiles.", "https://raw.githubusercontent.com/massif-maps/MassifMaps/master/docs/examples/screenshots/style-parameters.png", () => require('./StyleParameters.svelte')),
            entry("day-cycle-light", "Light the map by the hour", "One palette, no night theme: the scene light is read off a curve of `LightStop`s, and every colour on the map - 2D fills, labels, 3D walls - is derived from it. Swap the curve and the whole map changes character. The buildings follow the CAMERA as well as the hour: they rise over z15 and lie down when you zoom out (`building-height-scale`), sink towards the ground as the tilt approaches 90 (`building-height-view-scale`), and the map drops to a flat 2D render at the top of that tilt.", "https://raw.githubusercontent.com/massif-maps/MassifMaps/master/docs/examples/screenshots/day-cycle-light.png", () => require('./DayCycleLight.svelte')),
            entry("3d-models", "Draw 3D models", "A CartoCSS `model` rule places a .glb at every point: trees with a random model, size, heading and tint each, and a wind turbine whose rotor spins. Massif's own trees take `params.models_3d` and their .glb files added to the style package.", "https://raw.githubusercontent.com/massif-maps/MassifMaps/master/docs/examples/screenshots/3d-models.png", () => require('./3dModels.svelte')),
            entry("label-styling", "Shields, font icons and callouts", "Label styling is CartoCSS alone: a name takes the free side of its icon, an icon is a glyph of an image or a font on a plate, a trail's ref repeats along it, and summit names lift onto leader lines instead of hiding.", "https://raw.githubusercontent.com/massif-maps/MassifMaps/master/docs/examples/screenshots/label-styling.png", () => require('./LabelStyling.svelte')),
        ]
    },
    {
        id: "terrain",
        title: "3D terrain",
        description: "Elevation, hillshade, sky and fog.",
        examples: [
            entry("terrain-3d", "3D terrain, hybrid", "Satellite imagery draped over an elevation mesh, with roads and summit labels above it. One DEM source drives the mesh, the hillshade and the elevation queries.", "https://raw.githubusercontent.com/massif-maps/MassifMaps/master/docs/examples/screenshots/terrain-3d.png", () => require('./Terrain3d.svelte')),
            entry("terrain-2d-3d", "2D / 3D switch", "One flag switches a composite layer - Massif outdoor, hillshade and contours over one shared DEM - between flat and 3D terrain. Full switch decides whether a flat map still pays for 3D, auto by tilt lets a tilt gesture do the switching, match flight drives the terrain off the camera's own clock, and shadows show what the switch costs with a shadow pass in the frame.", "https://raw.githubusercontent.com/massif-maps/MassifMaps/master/docs/examples/screenshots/terrain-2d-3d.png", () => require('./Terrain2d3d.svelte')),
            entry("atmosphere", "Sky, fog and the day cycle", "A physical atmosphere over 3D terrain: dawn, noon, dusk and night, with the fog lit by the same sun, stars beyond it, and summits standing clear of the haze filling the valley.", "https://raw.githubusercontent.com/massif-maps/MassifMaps/master/docs/examples/screenshots/atmosphere.png", () => require('./Atmosphere.svelte')),
            entry("celestial-objects", "Objects in the sky", "Stars, the figure of Orion and their names drawn in the sky over 3D terrain, setting behind the Matterhorn as the sky turns. The camera looks up at them, and a tap names the star.", "https://raw.githubusercontent.com/massif-maps/MassifMaps/master/docs/examples/screenshots/celestial-objects.png", () => require('./CelestialObjects.svelte')),
            entry("peak-finder", "Peak finder", "A panorama drawn as peakfinder.com draws it: the terrain as ink on paper from a shader, every summit named along the skyline, and the sun's path with its rise and set over the ridges. Drag to look around, tap a name, then fly to it.", "https://raw.githubusercontent.com/massif-maps/MassifMaps/master/docs/examples/screenshots/peak-finder.png", () => require('./PeakFinder.svelte')),
        ]
    },
    {
        id: "annotations",
        title: "Markers & popups",
        description: "Things an app puts on the map itself.",
        examples: [
            entry("markers", "Markers and popups", "addMarker takes a spec that carries the position AND the style. Tap a summit for a balloon popup; tap the map to dismiss it.", "https://raw.githubusercontent.com/massif-maps/MassifMaps/master/docs/examples/screenshots/markers.png", () => require('./Markers.svelte')),
        ]
    },
    {
        id: "interaction",
        title: "Interaction",
        description: "Clicks, features and live updates.",
        examples: [
            entry("feature-click", "Get the feature under a tap", "The click payload is read lazily by path, so asking for one property never parses the whole feature - and a handler that found what it wanted returns true to claim the click, so nothing after it sees the tap.", "https://raw.githubusercontent.com/massif-maps/MassifMaps/master/docs/examples/screenshots/feature-click.png", () => require('./FeatureClick.svelte')),
            entry("map-events", "Refresh data when the map settles", "map.stable fires once when a movement ends, with the reason that caused it - so a data refresh runs once per gesture, and never for your own camera calls.", "https://raw.githubusercontent.com/massif-maps/MassifMaps/master/docs/examples/screenshots/map-events.png", () => require('./MapEvents.svelte')),
        ]
    },
    {
        id: "search",
        title: "Search & routing",
        description: "Finding features and getting from A to B.",
        examples: [
            entry("search-features", "Search the map's own tiles", "Every filter on a search request is an ordinary property. Runs async, because a search fetches and decodes every tile in range.", "https://raw.githubusercontent.com/massif-maps/MassifMaps/master/docs/examples/screenshots/search-features.png", () => require('./SearchFeatures.svelte')),
            entry("maneuver-arrows", "Navigation maneuver arrows", "A drive round Annecy station - turns, roundabouts, a U-turn and a lane change - each cut from the route and drawn as one line whose head is a line property: no marker, no bitmap, and a casing that outlines shaft and head alike.", "https://raw.githubusercontent.com/massif-maps/MassifMaps/master/docs/examples/screenshots/maneuver-arrows.png", () => require('./ManeuverArrows.svelte')),
        ]
    },
];

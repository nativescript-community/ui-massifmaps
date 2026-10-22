import { File, knownFolders, path } from '@nativescript/core';
import type { SourceSpec, StyleSpec } from '@nativescript-community/ui-massifmaps/api';

/**
 * What every ported example needs, in one place.
 *
 * These are the NativeScript equivalents of the constants the Android examples share.
 */

/** A tile server wants to know who is asking: a real app identifies itself. */
export const UA = 'MassifMapsExamples/1.0 (+https://github.com/massif-maps/MassifMaps)';

/**
 * A persistent tile cache in front of a remote source.
 *
 * Every example that reads from a server goes through one: a demo that gets panned around
 * otherwise re-fetches the same tiles from somebody else's free service on every run.
 */
export function cached(name: string, capacityMb: number, source: SourceSpec): SourceSpec {
    const databasePath = path.join(knownFolders.documents().path, name);
    console.log(`[massif-ex] cache ${databasePath} exists ${File.exists(databasePath)}`);
    return {
        type: 'persistent-cache',
        databasePath,
        capacity: capacityMb * 1024 * 1024,
        source
    };
}

/** OpenFreeMap's planet vector tiles, in the OpenMapTiles schema. */
export function vectorTiles(): SourceSpec {
    return cached('openfreemap.db', 100, {
        type: 'http',
        url: 'https://tiles.openfreemap.org/planet/latest/{z}/{x}/{y}.pbf',
        maxZoom: 14,
        HTTPHeaders: { 'User-Agent': UA }
    });
}

/** Esri's world imagery - the raster under the 3D terrain examples. */
export function satelliteTiles(): SourceSpec {
    return cached('world-imagery.db', 200, {
        type: 'http',
        // The {y}/{x} order is this server's; the template substitutes by name, so any order works.
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        maxZoom: 18,
        HTTPHeaders: { 'User-Agent': UA }
    });
}

/**
 * Open DEM tiles, terrarium-encoded.
 *
 * `metaData.dem_encoding` is what picks the elevation decoder, and it is resolved per TILE - the
 * source stamps its map on every tile it loads, so two encodings can sit behind one wrapper source.
 * Without it the SDK assumes mapbox encoding and every height is wrong.
 */
export function demTiles(): SourceSpec {
    // The encoding stays on the HTTP source, not on the cache in front of it: a wrapper source
    // with no map of its own answers with its wrapped source's.
    return cached('mapterhorn-dem.db', 200, {
        type: 'http',
        url: 'https://tiles.mapterhorn.com/{z}/{x}/{y}.webp',
        minZoom: 1,
        maxZoom: 16,
        metaData: { dem_encoding: 'terrarium' }
    });
}

/**
 * Massif as an `mbvt` style spec for `variant`: the `cartocss` project of `@massif-maps/styles`, which
 * demo-snippets/webpack.config.svelte.js copies into the app. Every variant is a style parameter of
 * it (`style.set('params.variant', 'eink')`). Async to match the Android and web examples' call sites.
 */
export async function massifStyle(variant = 'streets'): Promise<StyleSpec> {
    // a bundle package, not a dir: on Android the copied folder stays in the APK, not under files/app
    return { type: 'mbvt', project: { type: 'project', assets: { type: 'bundle', path: 'app/massif-style-iconfont' }, name: variant } } as StyleSpec;
}

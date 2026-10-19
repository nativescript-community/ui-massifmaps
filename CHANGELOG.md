# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.2](https://github.com/nativescript-community/ui-massifmaps/compare/v4.0.1...v4.0.2) (2026-10-19)

**Note:** Version bump only for package ui-massifmaps

## [4.0.1](https://github.com/nativescript-community/ui-massifmaps/compare/v4.0.0...v4.0.1) (2026-10-19)

### Features

* **api:** attach layer events by handle ([ebc4fd8](https://github.com/nativescript-community/ui-massifmaps/commit/ebc4fd8f29fcc0b858fd081fa9999191db9aaa16))

### Bug Fixes

* return a native screen position's x and y in order ([be8887e](https://github.com/nativescript-community/ui-massifmaps/commit/be8887eec2b15593025c76b2638d7ef7f4655bbb))

## [4.0.0](https://github.com/nativescript-community/ui-massifmaps/compare/v3.0.1...v4.0.0) (2026-10-09)

### ⚠ BREAKING CHANGES

* **layers:** CompositeVectorTileLayer.singlePassRenderingEnabled and the
singlePassRenderingEnabled option are gone. Drop any assignment; it had no effect.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
* map events require a surface-API SDK, and mapClicked no longer carries its
platform-specific `android` field.

Verified: tsc clean, and `node scripts/examples/check.mjs` reports "examples typecheck OK". The
Java and Swift are NOT compiled here and nothing ran on a device - the whole event path is
untested at runtime.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
* requires an SDK with MapMoveReason on MapEventListener (MassifMaps #163).
The native MapEventListener additions take an int reason where they took a boolean
userAction. App code reading `e.data.userAction` still works; `e.data.reason` is the one to
move to.

Verified: tsc clean over the whole plugin, and a temporary type test confirmed
`e.data.reason` infers as the string union from the event name (a deliberately wrong
annotation failed the build). NOT run on a device, and the Java/Swift additions are not
compile-checked here.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

### Features

* **api:** accept a nested spec or a handle wherever an object is expected ([df6f66c](https://github.com/nativescript-community/ui-massifmaps/commit/df6f66cc1f5d23c3b430f9dee319f6d330478dd7))
* **api:** add onCelestialClick for the celestial.clicked event ([7c1a540](https://github.com/nativescript-community/ui-massifmaps/commit/7c1a5407c03f02eeeaad8cac172ad31de5ce674b))
* **api:** add onSkyClick for the sky.clicked event ([1288ff4](https://github.com/nativescript-community/ui-massifmaps/commit/1288ff4529212b88692ae4553e3ab1d52eec5f36))
* **api:** add the celestial image object to the typings ([6176a97](https://github.com/nativescript-community/ui-massifmaps/commit/6176a972b37d77a64ba72dd11dcf4df4f1cb10c2))
* **api:** add wrapLayer and regenerate composite typings ([3187f27](https://github.com/nativescript-community/ui-massifmaps/commit/3187f274105bf09755dd3995f46f055c9a14e1ab))
* **api:** build the plugin on the SDK's surface API ([a6accd3](https://github.com/nativescript-community/ui-massifmaps/commit/a6accd31c2064236a9b76c03c93cb5a46bc07598)), closes [massif-maps/MassifMaps#146](https://github.com/massif-maps/MassifMaps/issues/146) [#159](https://github.com/nativescript-community/ui-massifmaps/issues/159)
* **api:** everything an app needs so this is its ONLY import ([cd5ec84](https://github.com/nativescript-community/ui-massifmaps/commit/cd5ec8448f8a791c99f6c23c0f64f38714b0db26))
* **api:** forward debounce through attach, and demo both rates ([79e8bb0](https://github.com/nativescript-community/ui-massifmaps/commit/79e8bb020d24d14db882d7331076b0cc2663535d))
* **api:** read an event's payload as properties, and add the missing events example ([03358a5](https://github.com/nativescript-community/ui-massifmaps/commit/03358a566fd54147bcd0f4fe393cdc8598009475))
* **api:** stand the camera eye on a position with MapCamera.moveEyeTo ([89ca8d6](https://github.com/nativescript-community/ui-massifmaps/commit/89ca8d621870c6c1aa4a60ebfee4e7521f6924e3))
* **api:** style parameters, aliases and one-crossing writes ([eb9aa7c](https://github.com/nativescript-community/ui-massifmaps/commit/eb9aa7c7f31c902d1191ab694d3d0003c2a93d97))
* **api:** use the SDK's ManeuverArrowBuilder in the maneuver-arrows example ([462cc8e](https://github.com/nativescript-community/ui-massifmaps/commit/462cc8e63eaa4ab335a04add14be08fa03413d35))
* **examples:** add sky objects, label styling and maneuver arrow examples ([b91993f](https://github.com/nativescript-community/ui-massifmaps/commit/b91993fe1cb5fc60fdea9941ebbf79ee4227acba))
* **examples:** add the 2D/3D switch example, and eyePosition on the camera ([bb34382](https://github.com/nativescript-community/ui-massifmaps/commit/bb343821373aea9edea136f346a058dda6daf06e))
* **examples:** add the peak finder to the gallery ([78986ce](https://github.com/nativescript-community/ui-massifmaps/commit/78986ce9e59add1eddbb3598477d2b054474441a))
* **examples:** add the sky/fog example, and cache every remote source ([948ad1b](https://github.com/nativescript-community/ui-massifmaps/commit/948ad1b6c20594c75d97f81fa98e24726804af3f))
* **examples:** draw every example with Massif, and add a Massif variants example ([d486ef4](https://github.com/nativescript-community/ui-massifmaps/commit/d486ef46b5e518dfea2a7ae2fe55e4cdff0e8889))
* **examples:** drive the 2D/3D switch three ways, and give the host a slider ([e2c822d](https://github.com/nativescript-community/ui-massifmaps/commit/e2c822dc29fb75badd3aec305858bdd669c6474f))
* **examples:** drive the day-cycle example by the hour, on a real sun position ([0b03f34](https://github.com/nativescript-community/ui-massifmaps/commit/0b03f340e1e921231ec0a084e8b45cf6c07b243a))
* **examples:** light the map by the hour, with a replaceable curve ([55419cb](https://github.com/nativescript-community/ui-massifmaps/commit/55419cbe2007f9f9fe9003ec2578879215037f41))
* **examples:** move maneuver-arrows to Annecy, with roundabouts, a U-turn and a lane change ([1100122](https://github.com/nativescript-community/ui-massifmaps/commit/11001227f17af970007316c22cd64554c10ba51f))
* **examples:** show the 2D/3D switch and the camera-driven building height in day-cycle-light ([3534ccf](https://github.com/nativescript-community/ui-massifmaps/commit/3534ccfd6148a2f04162f02a6d3e7a35064ece1d))
* **examples:** show the built-in light curve, and bound the tilted LOD ([d7bdbdb](https://github.com/nativescript-community/ui-massifmaps/commit/d7bdbdbe863264f5bc0ae410ba8f8dd12f0ba84a))
* take the map's events from the surface API, and delete the native listener ([657562a](https://github.com/nativescript-community/ui-massifmaps/commit/657562a24023778a35c45669cbdb3c8b86d85abc))
* take the map's move reason from the SDK, and type every map event ([cc49474](https://github.com/nativescript-community/ui-massifmaps/commit/cc49474b034567ddf722c7655f1b1a36e60c48b2))
* **ui:** let the map raise its events through the facade, per event ([f610728](https://github.com/nativescript-community/ui-massifmaps/commit/f61072849c008855fbb41433c026d9dd18138d42))

### Bug Fixes

* **api:** accept the handles, specs and paths the SDK already resolves ([7fef0d3](https://github.com/nativescript-community/ui-massifmaps/commit/7fef0d3b0a6ef19d7fdcc1673541e033340b86c9))
* **api:** follow the tile LOD option rename in the day-cycle example and typings ([d8939a8](https://github.com/nativescript-community/ui-massifmaps/commit/d8939a89450656affc1f170d044691d8e6b14686))
* **api:** move a layer instead of stacking it twice with moveTo ([806c5d5](https://github.com/nativescript-community/ui-massifmaps/commit/806c5d576b4209f312b4435ba739abec933631e2))
* **api:** never let an event handler abort the process, and tolerate a missing payload ([5fdf11b](https://github.com/nativescript-community/ui-massifmaps/commit/5fdf11b99a5fc1cee93eca93903b15152de5ff2f))
* **api:** reuse the view's facade in attach() instead of registering the map twice ([0054661](https://github.com/nativescript-community/ui-massifmaps/commit/0054661344c11af8c8210e40b0d741f264d55564))
* **bindings:** detect a SWIG enum by its shape, not by a method it no longer carries ([46d8058](https://github.com/nativescript-community/ui-massifmaps/commit/46d80584e03ef6131ea1cb216a4bd7e3c02adf5d))
* **bindings:** keep every class a facade call touches in the Android metadata ([eab0123](https://github.com/nativescript-community/ui-massifmaps/commit/eab0123f1bcd6b85b6576e805c093c0f097c7022))
* **bindings:** type an enum-typed accessor again, now the SDK spells it int ([98a8f95](https://github.com/nativescript-community/ui-massifmaps/commit/98a8f9574adbf73680aee7bd120913c26f40f479))
* **examples:** add the terrain the cast shadows land on ([1367339](https://github.com/nativescript-community/ui-massifmaps/commit/1367339c3b72f24fd5445c9cf2b997e828f2b296))
* **examples:** enable terrain lighting so the buildings cast ([3b81359](https://github.com/nativescript-community/ui-massifmaps/commit/3b813590284f915cabbcffb0c7e7675584d154e4))
* **examples:** load the day-cycle basemap and slow the 2D/3D flight to seconds ([b75239d](https://github.com/nativescript-community/ui-massifmaps/commit/b75239d28db3b85a71e04f871422589a93627d03))
* **examples:** match flight flies at once instead of waiting for 3D tiles ([4da04a6](https://github.com/nativescript-community/ui-massifmaps/commit/4da04a674550a37da637997194f11230a56ac5f8))
* **examples:** stop the day-cycle example drawing buildings out to the horizon ([407cdc1](https://github.com/nativescript-community/ui-massifmaps/commit/407cdc17d216412494d73b9998e23286e7da41cf))
* **examples:** sweep the hour, and clear a curve with an empty list ([838375a](https://github.com/nativescript-community/ui-massifmaps/commit/838375aad51a64895a53ca1656e144ade5668a01))
* **examples:** sweep the sun height, not the hour ([4f5a8de](https://github.com/nativescript-community/ui-massifmaps/commit/4f5a8de32bf37b9d19e316888bf44baaa8945930))
* **ios:** link OpenGLES and GLKit only outside Mac Catalyst ([6c65478](https://github.com/nativescript-community/ui-massifmaps/commit/6c6547895cbe187e6cc22692c23281e7f56bbc94))
* **ui-massifmaps:** register the iOS api event listener as a native class ([8117bc5](https://github.com/nativescript-community/ui-massifmaps/commit/8117bc589236ab63ed1d4a72c008944714a1b8f1))

### Performance Improvements

* **api:** build an event's payload getters once per class, not once per event ([8041e33](https://github.com/nativescript-community/ui-massifmaps/commit/8041e33eb6e68d1a218bc51198baa790fedb556f))

### Code Refactoring

* **layers:** remove CompositeVectorTileLayer's no-op singlePassRenderingEnabled ([d51addc](https://github.com/nativescript-community/ui-massifmaps/commit/d51addc12351a078ab64c425b008b8c1682b46ac))

## [3.0.1](https://github.com/nativescript-community/ui-massifmaps/compare/v3.0.0...v3.0.1) (2026-08-22)

### Bug Fixes

* add publishConfig access public for scoped npm package ([a345740](https://github.com/nativescript-community/ui-massifmaps/commit/a345740d0d02003a407ec6bffb4416f19bd8ae5d))

## [3.0.0](https://github.com/nativescript-community/ui-massifmaps/compare/v2.1.0...v3.0.0) (2026-08-21)

### ⚠ BREAKING CHANGES

* the package is now @nativescript-community/ui-massifmaps
and the public API classes/functions have been renamed.

Package and layout:
- @nativescript-community/ui-carto -> @nativescript-community/ui-massifmaps
- src/ui-carto -> src/ui-massifmaps, packages/ui-carto -> packages/ui-massifmaps
- typings carto.*.d.ts -> massifmaps.*.d.ts, ak.carto.*.d.ts -> ak.massifmaps.*.d.ts

Native API references:
- Android: com.carto.* -> com.massifmaps.*
- iOS: NT* class prefix -> MSF*
- native additions package com.akylas.carto.* -> com.nativescript.massifmaps.*
- CartoAdditions Xcode project/module -> MassifMapsAdditions
- CartoMobileSDK module -> MassifMaps

Public API:
- CartoMap -> MassifMap (XML element and CSSType are now MassifMap)
- CartoViewBase -> MassifMapViewBase
- CartoMapStyle -> MassifMapStyle
- getCartoBitmap -> getMassifBitmap
- nativeCartoImageProperty -> nativeMassifImageProperty
- gradle properties cartoSDKVersion/cartoSDKVariant ->
  massifSDKVersion/massifSDKVariant

Dependencies now target MassifMaps 6.0.0:
- com.github.massif-maps:MassifMaps-android-aar
- SPM massif-maps/MassifMaps-ios-swift (currently commented out)
- src-native Podfile pod 'MassifMaps'

CartoCSS names (CartoCSSStyleSet, StringCartoCSSStyleSetMap, the cartoCss
property) are kept, since upstream MassifMaps kept them. Both CHANGELOG.md
files are left untouched as historical records.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

### Features

* Added missing api methods to VectorElement ([dbfd4cf](https://github.com/nativescript-community/ui-massifmaps/commit/dbfd4cfeb7e1c68268c4fee19c0a2bcae140b5e0))
* generate native bindings from the ambient typings ([0fe2b62](https://github.com/nativescript-community/ui-massifmaps/commit/0fe2b62c79e0e3bb59cadc6a551fcbd97d54d8cd))
* rename plugin to ui-massifmaps ([33b1661](https://github.com/nativescript-community/ui-massifmaps/commit/33b1661777cd477af29910ef5f0fad3fc6e2625b))

### Bug Fixes

* Added back removed getNative calls ([d6cf7ab](https://github.com/nativescript-community/ui-massifmaps/commit/d6cf7ab45de8926468ff03077736a8dd6bce35af))
* Corrected broken types and methods ([6e47381](https://github.com/nativescript-community/ui-massifmaps/commit/6e473817699f784f954f75a03088184457d9b6aa))

## [2.1.0](https://github.com/nativescript-community/ui-carto/compare/v2.0.10...v2.1.0) (2026-05-02)

### Features

* support httpHeaders for ValhallaOnlineRoutingService ([ce02e8d](https://github.com/nativescript-community/ui-carto/commit/ce02e8d78c5e959f89c6c713d06941571147d004))

## [2.0.10](https://github.com/nativescript-community/ui-carto/compare/v2.0.9...v2.0.10) (2026-04-14)

### Bug Fixes

* **ui-carto:** android build fix ([0cd8d3a](https://github.com/nativescript-community/ui-carto/commit/0cd8d3aacb0c375e60a0a8b6312be5927213068a))

## [2.0.9](https://github.com/nativescript-community/ui-carto/compare/v2.0.8...v2.0.9) (2026-04-14)

### Bug Fixes

* **ui-carto:** android support for latest sdk ([ea1b21e](https://github.com/nativescript-community/ui-carto/commit/ea1b21ecefeedfa232c62dfafb029b6c7ad94799))

## [2.0.8](https://github.com/nativescript-community/ui-carto/compare/v2.0.7...v2.0.8) (2026-04-13)

### Bug Fixes

* **ui-carto:** android broken build ([7d98c91](https://github.com/nativescript-community/ui-carto/commit/7d98c91df87def41a9cd9526c717521a45ee3456))

## [2.0.7](https://github.com/nativescript-community/ui-carto/compare/v2.0.6...v2.0.7) (2026-04-07)

### Bug Fixes

* support new sdk features (pmtiles...) ([2b22c77](https://github.com/nativescript-community/ui-carto/commit/2b22c77af4b9f8616f8ac9693172a478eb10ce13))

## [2.0.6](https://github.com/nativescript-community/ui-carto/compare/v2.0.5...v2.0.6) (2026-03-16)

### Bug Fixes

* **ios:** ios build fix by using SPM ([1a8b0dc](https://github.com/nativescript-community/ui-carto/commit/1a8b0dcc69efebf8ccc3394352a43725c2048a44))

## [2.0.5](https://github.com/nativescript-community/ui-carto/compare/v2.0.4...v2.0.5) (2026-03-16)

### Bug Fixes

* **android:** native api usage fix ([c7c4b3b](https://github.com/nativescript-community/ui-carto/commit/c7c4b3b208ef585d27c16b2a268ed662c92f1ff8))

## [2.0.4](https://github.com/nativescript-community/ui-carto/compare/v2.0.3...v2.0.4) (2026-03-15)

### Bug Fixes

* **ui-carto:** ios missing APIs ([c1a3bd8](https://github.com/nativescript-community/ui-carto/commit/c1a3bd81e785ac79cd9d0623faac5d8b3115866f))

## [2.0.3](https://github.com/nativescript-community/ui-carto/compare/v2.0.2...v2.0.3) (2026-01-20)

### Bug Fixes

* **ios:** build fix ([13d7b5e](https://github.com/nativescript-community/ui-carto/commit/13d7b5e9e5509e48a1328a9af6654dc6db065489))

## [2.0.2](https://github.com/nativescript-community/ui-carto/compare/v2.0.1...v2.0.2) (2026-01-20)

### Bug Fixes

* **ios:** Update carto-mobile-sdk version to 5.0.1 ([579eb11](https://github.com/nativescript-community/ui-carto/commit/579eb11689857c5976a0011d36acc12fd92f5ca1))

## [2.0.1](https://github.com/nativescript-community/ui-carto/compare/v2.0.0...v2.0.1) (2026-01-14)

### Bug Fixes

* added missing js reference for map layers ([#8](https://github.com/nativescript-community/ui-carto/issues/8)) ([6231bb2](https://github.com/nativescript-community/ui-carto/commit/6231bb2cd66acabc0bf52fbbcb4e83579f02b3f2))
* added synchronous handler timeout to prevent deadlock ([712c83b](https://github.com/nativescript-community/ui-carto/commit/712c83b53e101b860ac48866eb150be20e5e7f10))
* **android:** build fix ([e18cd3b](https://github.com/nativescript-community/ui-carto/commit/e18cd3b3feff0434d95fdd64664331b5c3c84f5d))
* **android:** you can now set version with cartoSDKVersion but also change variant with cartoSDKVariant. You can use lite/standard which are smaller builds than the default one. But you loose some features like rooting, geocoding ... ([0de72fd](https://github.com/nativescript-community/ui-carto/commit/0de72fd8eeebef4dbdd63862eb588cd9961d0aad))

## [2.0.0](https://github.com/nativescript-community/ui-carto/compare/v1.8.21...v2.0.0) (2025-10-15)

### Features

* using latest sdk and available native SDK on iOS and Android ([e3bb8b2](https://github.com/nativescript-community/ui-carto/commit/e3bb8b2d2d840426ae80ddd024c77a4f747ac755))

### Bug Fixes

* DirAssetPackage now supports base package ([182c743](https://github.com/nativescript-community/ui-carto/commit/182c743d47e64120281ac07e234e7e70c481541d))
* **ios:** many fixes around search/routing ([e892540](https://github.com/nativescript-community/ui-carto/commit/e892540209a3086f9294e0bb85e6091a010b0c41))
* **ios:** utils fix ([773cfc7](https://github.com/nativescript-community/ui-carto/commit/773cfc7251d15ec1e3bc7adacbc5c88db24792c5))

## [1.8.21](https://github.com/nativescript-community/ui-carto/compare/v1.8.20...v1.8.21) (2025-07-15)

**Note:** Version bump only for package ui-carto

## [1.8.20](https://github.com/nativescript-community/ui-carto/compare/v1.8.19...v1.8.20) (2025-07-15)

**Note:** Version bump only for package ui-carto

## [1.8.19](https://github.com/nativescript-community/ui-carto/compare/v1.8.12-alpha.2...v1.8.19) (2025-07-15)

**Note:** Version bump only for package ui-carto

## [1.8.12-alpha.2](https://github.com/nativescript-community/ui-carto/compare/v1.8.12-alpha.1...v1.8.12-alpha.2) (2025-07-15)

### Bug Fixes

* improved isLocationOnPath ([c0ba1b8](https://github.com/nativescript-community/ui-carto/commit/c0ba1b80a09c7a5391a273a2fed50250157010ab))

## [1.8.12-alpha.1](https://github.com/nativescript-community/ui-carto/compare/v1.8.12-alpha.0...v1.8.12-alpha.1) (2025-06-16)

### Bug Fixes

* more VectorTileSearchService properties ([2e7c8ab](https://github.com/nativescript-community/ui-carto/commit/2e7c8ab3644bb7727c7bc3dfc7a98a39b2001f3a))
* setting property on non initialized but created object would prevent the property from being applied ([a9fb500](https://github.com/nativescript-community/ui-carto/commit/a9fb500839c01482f6914f798b38815ecd701261))

### Reverts

* Revert "chore: test release" ([da7a61f](https://github.com/nativescript-community/ui-carto/commit/da7a61fb21fb892416ce58ca8e85a6760be62593))

## [1.8.12-alpha.0](https://github.com/nativescript-community/ui-carto/compare/v1.8.11...v1.8.12-alpha.0) (2025-01-29)

### Features

* `defaultLayerBuffer` support for `GeoJSONVectorTileDataSource` ([e895a01](https://github.com/nativescript-community/ui-carto/commit/e895a01ab38f7369cbfc12985dee6c949fa4c910))
* `RouteMatchingResult` `getRawResult` ([9cedd30](https://github.com/nativescript-community/ui-carto/commit/9cedd30c9d10981d3abe9268b7f53d903fc41361))
* **android:** support for GLTextureView ([bf5a64c](https://github.com/nativescript-community/ui-carto/commit/bf5a64c1d4c42e281611efb8ab656822a6018b5d))
* borderWidth for text ([ceb033a](https://github.com/nativescript-community/ui-carto/commit/ceb033a14f396d6ed69902a8beadae1f70ef6392))
* cluster support for reporting cluster bbox ([f0f9df7](https://github.com/nativescript-community/ui-carto/commit/f0f9df757751128eae9ddd8596bae6999f1bc613))
* ClusteredVectorLayer `expandCluster` ([de23e3a](https://github.com/nativescript-community/ui-carto/commit/de23e3a515e6454c9b61d54f300bb7869ff666cb))
* feature as geojson ([e9eb3ae](https://github.com/nativescript-community/ui-carto/commit/e9eb3ae4105e7775f05da1e6decb31333a2e0036))
* GeoJSONVectorTileDataSource.setLayerGeoJSONString ([0d06b11](https://github.com/nativescript-community/ui-carto/commit/0d06b116b481d9f8c76d00af54522fe4a95298e3))
* GeoJSONVectorTileDataSource.simplifyTolerance ([d06aa6f](https://github.com/nativescript-community/ui-carto/commit/d06aa6f04d0b0532bee05af396672c28fd783384))
* geometry features ([1739e45](https://github.com/nativescript-community/ui-carto/commit/1739e458d2e020df15f80e57b94d5b64ae22d84e))
* Geometry.writeGeometry ([ec84932](https://github.com/nativescript-community/ui-carto/commit/ec84932405c3724d375ce394bc47aabcba014b68))
* hillshade shadowLAYER ([f851e08](https://github.com/nativescript-community/ui-carto/commit/f851e0878a41a523968467890688b1739aacafa9))
* in pair features between iOS and Android ([6b1f5ca](https://github.com/nativescript-community/ui-carto/commit/6b1f5caf8dc457ad3074f7d414cbbddbd223e0c0))
* **ios:** isLocationOnPath ([b26a753](https://github.com/nativescript-community/ui-carto/commit/b26a75323ad9f46b9c41165f8e05a6a73d50ce3c))
* loadTile method ([84a1705](https://github.com/nativescript-community/ui-carto/commit/84a1705747b7bf7fa413fa6f781861c54209cd90))
* map getZoom ([1a6a69a](https://github.com/nativescript-community/ui-carto/commit/1a6a69a2ab778faffb2cb28af3ec4e73e47eb614))
* maptiler online source ([37c90e3](https://github.com/nativescript-community/ui-carto/commit/37c90e3829732dbdfa2ae7ee617587413b7f42c6))
* minVisibleZoom/maxVisibleZoom ([a788b25](https://github.com/nativescript-community/ui-carto/commit/a788b2597b3b522e6a722df1307077eaa1c9d231))
* MultiTileDataSource ([2e7ec61](https://github.com/nativescript-community/ui-carto/commit/2e7ec6120f611459d16178421fbd3093558c5dcd))
* new `timeout` prop for http data sources ([873d010](https://github.com/nativescript-community/ui-carto/commit/873d0102f8e309c917d62d13936fdaaaa31a8ff7))
* new classes MultiValhallaOfflineRoutingService, MultiOSMOfflineGeocodingService and MultiOSMOfflineReverseGeocodingService ([61c19cc](https://github.com/nativescript-community/ui-carto/commit/61c19cc2c21492c1b8e03b6617ad215b4331288b))
* onMapInteraction ([abe38dd](https://github.com/nativescript-community/ui-carto/commit/abe38dde28555a337db6b6aed3c482ea77e52564))
* raster layer click ([10cd609](https://github.com/nativescript-community/ui-carto/commit/10cd609157fe20df02c3dd28845830bca7a4d34f))
* stopAllDownloads ([28a6cab](https://github.com/nativescript-community/ui-carto/commit/28a6cab72c70e0ce60f7de5eb31015bd8f3c75b9))
* TileDataSource maxOverzoomLevel ([9af25b6](https://github.com/nativescript-community/ui-carto/commit/9af25b6396a1f9b9e2c13f8d66a05dd20677dd54))

### Bug Fixes

* `Layers` fix ([5dbd400](https://github.com/nativescript-community/ui-carto/commit/5dbd40067d8c0b828f844be66eba1b961e18bac5))
* `reloadStyle` and missing `MBVectorTileDecoder` ([2af9714](https://github.com/nativescript-community/ui-carto/commit/2af97149a9185c4debf6e36bc512cc4562dc8052))
* a lot of fixes and improvements ([fc880bb](https://github.com/nativescript-community/ui-carto/commit/fc880bbc5db11716f4f76bdddd3ae76963dd2762))
* added all new features from latest sdk ([5408477](https://github.com/nativescript-community/ui-carto/commit/5408477cb61b844e05ece1d1da50d1dafd0030aa))
* Added support for adding event listeners from XML ([177e133](https://github.com/nativescript-community/ui-carto/commit/177e133de5fd92f5844f1ad28f0180df619898c9))
* allow vector listeners custom native class ([206901c](https://github.com/nativescript-community/ui-carto/commit/206901cf7c7187f54ddedf74ac622d814e3db9d5))
* **android:** allow correct object disposal with `dispose()` ([f0a4ec7](https://github.com/nativescript-community/ui-carto/commit/f0a4ec7a2bf7a7f2ec5bd0950271fb2ac178bd80))
* **android:** another cluster fix ([2114055](https://github.com/nativescript-community/ui-carto/commit/2114055bea57064e2d2bd2e41d0ea74d7db14b3c))
* **android:** cluster fix ([12d0dac](https://github.com/nativescript-community/ui-carto/commit/12d0dac8f33029558ec968a92525ec00ba7d8605))
* **android:** correctly clean up android bitmaps ([f91a432](https://github.com/nativescript-community/ui-carto/commit/f91a432d05246217c0a5d57c9f5c993460a48b4d))
* **android:** correctly pause resume map ([c919930](https://github.com/nativescript-community/ui-carto/commit/c919930f02515745fe7ec182ee695a0776eed001))
* **android:** isLocationOnPath fix ([3edc73f](https://github.com/nativescript-community/ui-carto/commit/3edc73f2a961c972c4d8b6381a1367a57436f572))
* **android:** native-api-usage ([5730170](https://github.com/nativescript-community/ui-carto/commit/5730170286d7919b75608bfb6763e04a3c6be6f5))
* **android:** native-api-usage optimisation ([2fe6540](https://github.com/nativescript-community/ui-carto/commit/2fe6540732d81a94e2ca8eeb5c577368f1aa2424))
* **android:** regression fix ([16949de](https://github.com/nativescript-community/ui-carto/commit/16949de6e1ec279e559f40c7ec6c5b4bd2cae66d))
* **android:** simplified enums handling ([fd097bf](https://github.com/nativescript-community/ui-carto/commit/fd097bfaf6b35725e434bdc7760faa6d71fb2a9b))
* **android:** use implementation ([d25e332](https://github.com/nativescript-community/ui-carto/commit/d25e33264ee22d41be32408e5a07ff7b588a155c))
* bunch of fixes ([561064c](https://github.com/nativescript-community/ui-carto/commit/561064ceb80d4153e01c370beb856e67edf9a0a4))
* catch errors on addLayer ([b1d978b](https://github.com/nativescript-community/ui-carto/commit/b1d978b720c36838c50775370f80cd080c60d7e3))
* cluster images fix (scale) ([fb07e36](https://github.com/nativescript-community/ui-carto/commit/fb07e366dbc4f826ef7b6e85f2e960ba0fbcf504))
* disposeNativeView handle ([10a3447](https://github.com/nativescript-community/ui-carto/commit/10a34471e50f52156ad8ef0a507de823ec04983d))
* download listener fix ([52e5515](https://github.com/nativescript-community/ui-carto/commit/52e5515285c0f05dec390c555ae026bfcf5076fa))
* ensure we create the nativeView if not created ([2b8f0af](https://github.com/nativescript-community/ui-carto/commit/2b8f0afe87a6ad767dac63d6996e8c2c2afe6cb2))
* events update ([3ab8001](https://github.com/nativescript-community/ui-carto/commit/3ab8001831a1a1ed34b13f9c604222b3d69d2858))
* faster variant from and to ([736ffc3](https://github.com/nativescript-community/ui-carto/commit/736ffc3c64928070f02df84faf23206864bb1973))
* fix for circular reference (this time working) ([d7aadeb](https://github.com/nativescript-community/ui-carto/commit/d7aadeb4aeec3b08fd4c798233881b96f66f900f))
* fully working clusters ([5a01e93](https://github.com/nativescript-community/ui-carto/commit/5a01e9310b5182a4f3c8a586cbfe516fc2d819e2))
* geocoding autocomplete fix ([3a2b520](https://github.com/nativescript-community/ui-carto/commit/3a2b5204214c403cf1ab636823538e51c2c551b0))
* getter fix ([5de7efe](https://github.com/nativescript-community/ui-carto/commit/5de7efec64592e4dfb4360b97bfa9271c5f00ded))
* HTTPTileDataSource inheritance ([a8b4161](https://github.com/nativescript-community/ui-carto/commit/a8b416134990886ca5330665d0fafc817abaec6f))
* **ios:**  VectorElementVector fix ([50e0784](https://github.com/nativescript-community/ui-carto/commit/50e07845571586add02c4519d364c135a53e373b))
* **ios:** calculateRoute customOptions ([8fabc5e](https://github.com/nativescript-community/ui-carto/commit/8fabc5e1909564b1b8629d4ae893d18dd4baddd6))
* **ios:** cluster layer in pair with android ([016471e](https://github.com/nativescript-community/ui-carto/commit/016471e67c65c45426716cd2ab0cd5ffa7013d5f))
* **ios:** findFeatures callback fix ([a8e9802](https://github.com/nativescript-community/ui-carto/commit/a8e9802c1149dd236688bf93fd9608db607ebec8))
* **ios:** fixed isLocationOnPath and distanceToEnd ([c77b33e](https://github.com/nativescript-community/ui-carto/commit/c77b33e07eee9435ca931fc3711c084f13d3f190))
* **ios:** Layers fix ([65957fe](https://github.com/nativescript-community/ui-carto/commit/65957fe6e287499af612c226c7843088c08015f6))
* **ios:** missing build flag ([e6d19dd](https://github.com/nativescript-community/ui-carto/commit/e6d19ddfec71c4406beda778bb62b549279320c3))
* **ios:** resource loading fix ([640b663](https://github.com/nativescript-community/ui-carto/commit/640b6639c6b3a328cfef98d9a4a9dfaf01360d06))
* **ios:** resource loading fix ([351c7ac](https://github.com/nativescript-community/ui-carto/commit/351c7ac7290ce3f8dd987fa531faea56bbc4044e))
* **ios:** support setRunOnMainThread (true by default) ([6044fb1](https://github.com/nativescript-community/ui-carto/commit/6044fb114bda610a13038397748891970dd30195))
* **ios:** typo error on MapPosVector and MapPosVectorVector ([dd86e23](https://github.com/nativescript-community/ui-carto/commit/dd86e238add284855079861bf21c6523dc257d82))
* LocalVectorLayer addFeatureCollection fix ([28ddce0](https://github.com/nativescript-community/ui-carto/commit/28ddce08433d1a836b437d7d0660c1e4766e0e00))
* marker allow dynamic values change ([d98fbdb](https://github.com/nativescript-community/ui-carto/commit/d98fbdb60692103ec90b396cd68c3bd1cce62d18))
* matchRoute fixes ([7b2f050](https://github.com/nativescript-community/ui-carto/commit/7b2f0508a7cbf612d70f74b8ddd6af6d529f7ba5))
* minZoom/maxZoom getters fix ([5a6bb5f](https://github.com/nativescript-community/ui-carto/commit/5a6bb5fc1d25158dfc7be2319c3b75c271eab845))
* missing font typing for ClusterElementBuilderOptions ([5a9ca5a](https://github.com/nativescript-community/ui-carto/commit/5a9ca5a8c000759f91e7af0468bcc327b0fa82b4))
* missing motorcycle valhalla profile ([6ce9c5f](https://github.com/nativescript-community/ui-carto/commit/6ce9c5f85921a3076622b9477b1eaa9cc654e8a4))
* missing refresh signature ([6a53737](https://github.com/nativescript-community/ui-carto/commit/6a537370324cce18c3811744e307bb8f373c4a6d))
* more work on `getRawResult` for routing ([f6fafff](https://github.com/nativescript-community/ui-carto/commit/f6fafffba8e42df61d4057a983f36cc85e3b498e))
* prevent error ([47bf350](https://github.com/nativescript-community/ui-carto/commit/47bf350789d75b917fa9ed7a2460494c211a7cac))
* prevent error on null image proeprties ([d441121](https://github.com/nativescript-community/ui-carto/commit/d4411210864b927d28fb14b2ad1b325829332867))
* prevent errors in production ([9e98710](https://github.com/nativescript-community/ui-carto/commit/9e9871036c8d6ee2ed8e89109b4b1bad2d72a013))
* protect against memory leaks ([6c46ccc](https://github.com/nativescript-community/ui-carto/commit/6c46cccd07e4aa94bdcb8e1951adbb1f18d5ae17))
* refactor to avoid import circular references ([3789c07](https://github.com/nativescript-community/ui-carto/commit/3789c07552f43197f530c070f4589e574c407e53))
* refactoring and cleanup of the routing services ([58e5052](https://github.com/nativescript-community/ui-carto/commit/58e5052db2d0113c4cf4ca47f74d3b4487650805))
* regression fix ([32e4788](https://github.com/nativescript-community/ui-carto/commit/32e4788632a4b9de33346f2deaf04e1a67b2b86c))
* return colors as Color ([5aa1fb1](https://github.com/nativescript-community/ui-carto/commit/5aa1fb180072dd63a1da9f6b474d8044d54f757b))
* route methods as promise ([7b6f6bd](https://github.com/nativescript-community/ui-carto/commit/7b6f6bdb9228c9e818eb395b114fa7c21cf20d78))
* RouteMatchingRequest customOptions ([af50050](https://github.com/nativescript-community/ui-carto/commit/af50050384ba30bcb9807558d6f781b13c1202e9))
* routing ensure we use the correct profile ([c1833e4](https://github.com/nativescript-community/ui-carto/commit/c1833e43089acdccf55ea40db25da03456ce7900))
* scheme ([b96f7f1](https://github.com/nativescript-community/ui-carto/commit/b96f7f10af59c9a31e18a0ae881f1aaf8b01e866))
* scheme support for `MBTilesTileDataSource` ([1b5fcb3](https://github.com/nativescript-community/ui-carto/commit/1b5fcb336018e6482ecab8a91584f9d03ee5ecbd))
* some hillshade fixes ([a1f8403](https://github.com/nativescript-community/ui-carto/commit/a1f84037b189d64ba7c14710583b467085ad7df6))
* submodules remote location ([490d62b](https://github.com/nativescript-community/ui-carto/commit/490d62b1e4d9c212aa0f9a2dac7a20efb93b6351))
* support for rendererLayerFilter and clickHandlerLayerFilter ([4889e95](https://github.com/nativescript-community/ui-carto/commit/4889e9524a3dff45ca514b6c2c393e8299003d93))
* support MultiPoint point geometry in onVectorTileClicked ([5bcaaa2](https://github.com/nativescript-community/ui-carto/commit/5bcaaa200dca85e43c7807375641ad0d41b4f81b))
* support new valhalla addLocale ([80417a7](https://github.com/nativescript-community/ui-carto/commit/80417a78f5f46efd75bd539f974c8b01e6a06a92))
* toJSON for MapBounds ([5c193c8](https://github.com/nativescript-community/ui-carto/commit/5c193c85f4c291232214a3360e2361536cf4d284))
* typings fix ([55add44](https://github.com/nativescript-community/ui-carto/commit/55add44b21ded30a21c195ac0144c6c6e7384554))
* typings fix ([f36521f](https://github.com/nativescript-community/ui-carto/commit/f36521ff106c9b9c27e40822ef680d907b17646a))
* typings fix ([1ad6c33](https://github.com/nativescript-community/ui-carto/commit/1ad6c3371b16e352f997a1a5fa22af8f764fd5c4))
* update for latest sdk ([bb64e97](https://github.com/nativescript-community/ui-carto/commit/bb64e97989c6ae1909a88a9e67f3aa11f228a5fb))
* update to latest native SDK ([8a9e185](https://github.com/nativescript-community/ui-carto/commit/8a9e185458ea84b15a8e926dfab337b62159fa1b))
* use MapRange as array everywhere ([2e65cfe](https://github.com/nativescript-community/ui-carto/commit/2e65cfe95e93c8659b3c3e5137ddc43762abbcfd))
* wrong MBTilesTileDataSource parent class ([703a678](https://github.com/nativescript-community/ui-carto/commit/703a67854de3fb60388fc1df0e526eb7ae0814ff))

## [1.8.12-alpha.0](https://github.com/nativescript-community/ui-carto/compare/v1.8.11...v1.8.12-alpha.0) (2025-01-29)

### Features

* `defaultLayerBuffer` support for `GeoJSONVectorTileDataSource` ([e895a01](https://github.com/nativescript-community/ui-carto/commit/e895a01ab38f7369cbfc12985dee6c949fa4c910))
* `RouteMatchingResult` `getRawResult` ([9cedd30](https://github.com/nativescript-community/ui-carto/commit/9cedd30c9d10981d3abe9268b7f53d903fc41361))
* **android:** support for GLTextureView ([bf5a64c](https://github.com/nativescript-community/ui-carto/commit/bf5a64c1d4c42e281611efb8ab656822a6018b5d))
* borderWidth for text ([ceb033a](https://github.com/nativescript-community/ui-carto/commit/ceb033a14f396d6ed69902a8beadae1f70ef6392))
* cluster support for reporting cluster bbox ([f0f9df7](https://github.com/nativescript-community/ui-carto/commit/f0f9df757751128eae9ddd8596bae6999f1bc613))
* ClusteredVectorLayer `expandCluster` ([de23e3a](https://github.com/nativescript-community/ui-carto/commit/de23e3a515e6454c9b61d54f300bb7869ff666cb))
* feature as geojson ([e9eb3ae](https://github.com/nativescript-community/ui-carto/commit/e9eb3ae4105e7775f05da1e6decb31333a2e0036))
* GeoJSONVectorTileDataSource.setLayerGeoJSONString ([0d06b11](https://github.com/nativescript-community/ui-carto/commit/0d06b116b481d9f8c76d00af54522fe4a95298e3))
* GeoJSONVectorTileDataSource.simplifyTolerance ([d06aa6f](https://github.com/nativescript-community/ui-carto/commit/d06aa6f04d0b0532bee05af396672c28fd783384))
* geometry features ([1739e45](https://github.com/nativescript-community/ui-carto/commit/1739e458d2e020df15f80e57b94d5b64ae22d84e))
* Geometry.writeGeometry ([ec84932](https://github.com/nativescript-community/ui-carto/commit/ec84932405c3724d375ce394bc47aabcba014b68))
* hillshade shadowLAYER ([f851e08](https://github.com/nativescript-community/ui-carto/commit/f851e0878a41a523968467890688b1739aacafa9))
* in pair features between iOS and Android ([6b1f5ca](https://github.com/nativescript-community/ui-carto/commit/6b1f5caf8dc457ad3074f7d414cbbddbd223e0c0))
* **ios:** isLocationOnPath ([b26a753](https://github.com/nativescript-community/ui-carto/commit/b26a75323ad9f46b9c41165f8e05a6a73d50ce3c))
* loadTile method ([84a1705](https://github.com/nativescript-community/ui-carto/commit/84a1705747b7bf7fa413fa6f781861c54209cd90))
* map getZoom ([1a6a69a](https://github.com/nativescript-community/ui-carto/commit/1a6a69a2ab778faffb2cb28af3ec4e73e47eb614))
* maptiler online source ([37c90e3](https://github.com/nativescript-community/ui-carto/commit/37c90e3829732dbdfa2ae7ee617587413b7f42c6))
* minVisibleZoom/maxVisibleZoom ([a788b25](https://github.com/nativescript-community/ui-carto/commit/a788b2597b3b522e6a722df1307077eaa1c9d231))
* MultiTileDataSource ([2e7ec61](https://github.com/nativescript-community/ui-carto/commit/2e7ec6120f611459d16178421fbd3093558c5dcd))
* new `timeout` prop for http data sources ([873d010](https://github.com/nativescript-community/ui-carto/commit/873d0102f8e309c917d62d13936fdaaaa31a8ff7))
* new classes MultiValhallaOfflineRoutingService, MultiOSMOfflineGeocodingService and MultiOSMOfflineReverseGeocodingService ([61c19cc](https://github.com/nativescript-community/ui-carto/commit/61c19cc2c21492c1b8e03b6617ad215b4331288b))
* onMapInteraction ([abe38dd](https://github.com/nativescript-community/ui-carto/commit/abe38dde28555a337db6b6aed3c482ea77e52564))
* raster layer click ([10cd609](https://github.com/nativescript-community/ui-carto/commit/10cd609157fe20df02c3dd28845830bca7a4d34f))
* stopAllDownloads ([28a6cab](https://github.com/nativescript-community/ui-carto/commit/28a6cab72c70e0ce60f7de5eb31015bd8f3c75b9))
* TileDataSource maxOverzoomLevel ([9af25b6](https://github.com/nativescript-community/ui-carto/commit/9af25b6396a1f9b9e2c13f8d66a05dd20677dd54))

### Bug Fixes

* `Layers` fix ([5dbd400](https://github.com/nativescript-community/ui-carto/commit/5dbd40067d8c0b828f844be66eba1b961e18bac5))
* `reloadStyle` and missing `MBVectorTileDecoder` ([2af9714](https://github.com/nativescript-community/ui-carto/commit/2af97149a9185c4debf6e36bc512cc4562dc8052))
* a lot of fixes and improvements ([fc880bb](https://github.com/nativescript-community/ui-carto/commit/fc880bbc5db11716f4f76bdddd3ae76963dd2762))
* added all new features from latest sdk ([5408477](https://github.com/nativescript-community/ui-carto/commit/5408477cb61b844e05ece1d1da50d1dafd0030aa))
* Added support for adding event listeners from XML ([177e133](https://github.com/nativescript-community/ui-carto/commit/177e133de5fd92f5844f1ad28f0180df619898c9))
* allow vector listeners custom native class ([206901c](https://github.com/nativescript-community/ui-carto/commit/206901cf7c7187f54ddedf74ac622d814e3db9d5))
* **android:** allow correct object disposal with `dispose()` ([f0a4ec7](https://github.com/nativescript-community/ui-carto/commit/f0a4ec7a2bf7a7f2ec5bd0950271fb2ac178bd80))
* **android:** another cluster fix ([2114055](https://github.com/nativescript-community/ui-carto/commit/2114055bea57064e2d2bd2e41d0ea74d7db14b3c))
* **android:** cluster fix ([12d0dac](https://github.com/nativescript-community/ui-carto/commit/12d0dac8f33029558ec968a92525ec00ba7d8605))
* **android:** correctly clean up android bitmaps ([f91a432](https://github.com/nativescript-community/ui-carto/commit/f91a432d05246217c0a5d57c9f5c993460a48b4d))
* **android:** correctly pause resume map ([c919930](https://github.com/nativescript-community/ui-carto/commit/c919930f02515745fe7ec182ee695a0776eed001))
* **android:** isLocationOnPath fix ([3edc73f](https://github.com/nativescript-community/ui-carto/commit/3edc73f2a961c972c4d8b6381a1367a57436f572))
* **android:** native-api-usage ([5730170](https://github.com/nativescript-community/ui-carto/commit/5730170286d7919b75608bfb6763e04a3c6be6f5))
* **android:** native-api-usage optimisation ([2fe6540](https://github.com/nativescript-community/ui-carto/commit/2fe6540732d81a94e2ca8eeb5c577368f1aa2424))
* **android:** regression fix ([16949de](https://github.com/nativescript-community/ui-carto/commit/16949de6e1ec279e559f40c7ec6c5b4bd2cae66d))
* **android:** simplified enums handling ([fd097bf](https://github.com/nativescript-community/ui-carto/commit/fd097bfaf6b35725e434bdc7760faa6d71fb2a9b))
* **android:** use implementation ([d25e332](https://github.com/nativescript-community/ui-carto/commit/d25e33264ee22d41be32408e5a07ff7b588a155c))
* bunch of fixes ([561064c](https://github.com/nativescript-community/ui-carto/commit/561064ceb80d4153e01c370beb856e67edf9a0a4))
* catch errors on addLayer ([b1d978b](https://github.com/nativescript-community/ui-carto/commit/b1d978b720c36838c50775370f80cd080c60d7e3))
* cluster images fix (scale) ([fb07e36](https://github.com/nativescript-community/ui-carto/commit/fb07e366dbc4f826ef7b6e85f2e960ba0fbcf504))
* disposeNativeView handle ([10a3447](https://github.com/nativescript-community/ui-carto/commit/10a34471e50f52156ad8ef0a507de823ec04983d))
* download listener fix ([52e5515](https://github.com/nativescript-community/ui-carto/commit/52e5515285c0f05dec390c555ae026bfcf5076fa))
* ensure we create the nativeView if not created ([2b8f0af](https://github.com/nativescript-community/ui-carto/commit/2b8f0afe87a6ad767dac63d6996e8c2c2afe6cb2))
* events update ([3ab8001](https://github.com/nativescript-community/ui-carto/commit/3ab8001831a1a1ed34b13f9c604222b3d69d2858))
* faster variant from and to ([736ffc3](https://github.com/nativescript-community/ui-carto/commit/736ffc3c64928070f02df84faf23206864bb1973))
* fix for circular reference (this time working) ([d7aadeb](https://github.com/nativescript-community/ui-carto/commit/d7aadeb4aeec3b08fd4c798233881b96f66f900f))
* fully working clusters ([5a01e93](https://github.com/nativescript-community/ui-carto/commit/5a01e9310b5182a4f3c8a586cbfe516fc2d819e2))
* geocoding autocomplete fix ([3a2b520](https://github.com/nativescript-community/ui-carto/commit/3a2b5204214c403cf1ab636823538e51c2c551b0))
* getter fix ([5de7efe](https://github.com/nativescript-community/ui-carto/commit/5de7efec64592e4dfb4360b97bfa9271c5f00ded))
* HTTPTileDataSource inheritance ([a8b4161](https://github.com/nativescript-community/ui-carto/commit/a8b416134990886ca5330665d0fafc817abaec6f))
* **ios:**  VectorElementVector fix ([50e0784](https://github.com/nativescript-community/ui-carto/commit/50e07845571586add02c4519d364c135a53e373b))
* **ios:** calculateRoute customOptions ([8fabc5e](https://github.com/nativescript-community/ui-carto/commit/8fabc5e1909564b1b8629d4ae893d18dd4baddd6))
* **ios:** cluster layer in pair with android ([016471e](https://github.com/nativescript-community/ui-carto/commit/016471e67c65c45426716cd2ab0cd5ffa7013d5f))
* **ios:** findFeatures callback fix ([a8e9802](https://github.com/nativescript-community/ui-carto/commit/a8e9802c1149dd236688bf93fd9608db607ebec8))
* **ios:** fixed isLocationOnPath and distanceToEnd ([c77b33e](https://github.com/nativescript-community/ui-carto/commit/c77b33e07eee9435ca931fc3711c084f13d3f190))
* **ios:** Layers fix ([65957fe](https://github.com/nativescript-community/ui-carto/commit/65957fe6e287499af612c226c7843088c08015f6))
* **ios:** missing build flag ([e6d19dd](https://github.com/nativescript-community/ui-carto/commit/e6d19ddfec71c4406beda778bb62b549279320c3))
* **ios:** resource loading fix ([640b663](https://github.com/nativescript-community/ui-carto/commit/640b6639c6b3a328cfef98d9a4a9dfaf01360d06))
* **ios:** resource loading fix ([351c7ac](https://github.com/nativescript-community/ui-carto/commit/351c7ac7290ce3f8dd987fa531faea56bbc4044e))
* **ios:** support setRunOnMainThread (true by default) ([6044fb1](https://github.com/nativescript-community/ui-carto/commit/6044fb114bda610a13038397748891970dd30195))
* **ios:** typo error on MapPosVector and MapPosVectorVector ([dd86e23](https://github.com/nativescript-community/ui-carto/commit/dd86e238add284855079861bf21c6523dc257d82))
* LocalVectorLayer addFeatureCollection fix ([28ddce0](https://github.com/nativescript-community/ui-carto/commit/28ddce08433d1a836b437d7d0660c1e4766e0e00))
* marker allow dynamic values change ([d98fbdb](https://github.com/nativescript-community/ui-carto/commit/d98fbdb60692103ec90b396cd68c3bd1cce62d18))
* matchRoute fixes ([7b2f050](https://github.com/nativescript-community/ui-carto/commit/7b2f0508a7cbf612d70f74b8ddd6af6d529f7ba5))
* minZoom/maxZoom getters fix ([5a6bb5f](https://github.com/nativescript-community/ui-carto/commit/5a6bb5fc1d25158dfc7be2319c3b75c271eab845))
* missing font typing for ClusterElementBuilderOptions ([5a9ca5a](https://github.com/nativescript-community/ui-carto/commit/5a9ca5a8c000759f91e7af0468bcc327b0fa82b4))
* missing motorcycle valhalla profile ([6ce9c5f](https://github.com/nativescript-community/ui-carto/commit/6ce9c5f85921a3076622b9477b1eaa9cc654e8a4))
* missing refresh signature ([6a53737](https://github.com/nativescript-community/ui-carto/commit/6a537370324cce18c3811744e307bb8f373c4a6d))
* more work on `getRawResult` for routing ([f6fafff](https://github.com/nativescript-community/ui-carto/commit/f6fafffba8e42df61d4057a983f36cc85e3b498e))
* prevent error ([47bf350](https://github.com/nativescript-community/ui-carto/commit/47bf350789d75b917fa9ed7a2460494c211a7cac))
* prevent error on null image proeprties ([d441121](https://github.com/nativescript-community/ui-carto/commit/d4411210864b927d28fb14b2ad1b325829332867))
* prevent errors in production ([9e98710](https://github.com/nativescript-community/ui-carto/commit/9e9871036c8d6ee2ed8e89109b4b1bad2d72a013))
* protect against memory leaks ([6c46ccc](https://github.com/nativescript-community/ui-carto/commit/6c46cccd07e4aa94bdcb8e1951adbb1f18d5ae17))
* refactor to avoid import circular references ([3789c07](https://github.com/nativescript-community/ui-carto/commit/3789c07552f43197f530c070f4589e574c407e53))
* refactoring and cleanup of the routing services ([58e5052](https://github.com/nativescript-community/ui-carto/commit/58e5052db2d0113c4cf4ca47f74d3b4487650805))
* regression fix ([32e4788](https://github.com/nativescript-community/ui-carto/commit/32e4788632a4b9de33346f2deaf04e1a67b2b86c))
* return colors as Color ([5aa1fb1](https://github.com/nativescript-community/ui-carto/commit/5aa1fb180072dd63a1da9f6b474d8044d54f757b))
* route methods as promise ([7b6f6bd](https://github.com/nativescript-community/ui-carto/commit/7b6f6bdb9228c9e818eb395b114fa7c21cf20d78))
* RouteMatchingRequest customOptions ([af50050](https://github.com/nativescript-community/ui-carto/commit/af50050384ba30bcb9807558d6f781b13c1202e9))
* routing ensure we use the correct profile ([c1833e4](https://github.com/nativescript-community/ui-carto/commit/c1833e43089acdccf55ea40db25da03456ce7900))
* scheme ([b96f7f1](https://github.com/nativescript-community/ui-carto/commit/b96f7f10af59c9a31e18a0ae881f1aaf8b01e866))
* scheme support for `MBTilesTileDataSource` ([1b5fcb3](https://github.com/nativescript-community/ui-carto/commit/1b5fcb336018e6482ecab8a91584f9d03ee5ecbd))
* some hillshade fixes ([a1f8403](https://github.com/nativescript-community/ui-carto/commit/a1f84037b189d64ba7c14710583b467085ad7df6))
* submodules remote location ([490d62b](https://github.com/nativescript-community/ui-carto/commit/490d62b1e4d9c212aa0f9a2dac7a20efb93b6351))
* support for rendererLayerFilter and clickHandlerLayerFilter ([4889e95](https://github.com/nativescript-community/ui-carto/commit/4889e9524a3dff45ca514b6c2c393e8299003d93))
* support MultiPoint point geometry in onVectorTileClicked ([5bcaaa2](https://github.com/nativescript-community/ui-carto/commit/5bcaaa200dca85e43c7807375641ad0d41b4f81b))
* support new valhalla addLocale ([80417a7](https://github.com/nativescript-community/ui-carto/commit/80417a78f5f46efd75bd539f974c8b01e6a06a92))
* toJSON for MapBounds ([5c193c8](https://github.com/nativescript-community/ui-carto/commit/5c193c85f4c291232214a3360e2361536cf4d284))
* typings fix ([55add44](https://github.com/nativescript-community/ui-carto/commit/55add44b21ded30a21c195ac0144c6c6e7384554))
* typings fix ([f36521f](https://github.com/nativescript-community/ui-carto/commit/f36521ff106c9b9c27e40822ef680d907b17646a))
* typings fix ([1ad6c33](https://github.com/nativescript-community/ui-carto/commit/1ad6c3371b16e352f997a1a5fa22af8f764fd5c4))
* update for latest sdk ([bb64e97](https://github.com/nativescript-community/ui-carto/commit/bb64e97989c6ae1909a88a9e67f3aa11f228a5fb))
* update to latest native SDK ([8a9e185](https://github.com/nativescript-community/ui-carto/commit/8a9e185458ea84b15a8e926dfab337b62159fa1b))
* use MapRange as array everywhere ([2e65cfe](https://github.com/nativescript-community/ui-carto/commit/2e65cfe95e93c8659b3c3e5137ddc43762abbcfd))
* wrong MBTilesTileDataSource parent class ([703a678](https://github.com/nativescript-community/ui-carto/commit/703a67854de3fb60388fc1df0e526eb7ae0814ff))

## [1.8.11](https://github.com/nativescript-community/ui-carto/compare/v1.8.10...v1.8.11) (2022-01-20)

### Bug Fixes

* `Layers` fix ([38f1065](https://github.com/nativescript-community/ui-carto/commit/38f1065f863e56b569456ce344ed49e4a8605742))
* `reloadStyle` and missing `MBVectorTileDecoder` ([7b054f9](https://github.com/nativescript-community/ui-carto/commit/7b054f93c556d609af731aba46c0a7eb61bd6736))
* scheme ([d748bcf](https://github.com/nativescript-community/ui-carto/commit/d748bcf3e9531c1165dbbc8de185494a53977b97))
* scheme support for `MBTilesTileDataSource` ([6643e78](https://github.com/nativescript-community/ui-carto/commit/6643e78b1d30c5f8df6550a8f9de12e4b9bed85e))

### Features

* `defaultLayerBuffer` support for `GeoJSONVectorTileDataSource` ([a9428ee](https://github.com/nativescript-community/ui-carto/commit/a9428ee979a08a1a02cec5d227087b9d1dbfc16c))

## [1.8.10](https://github.com/nativescript-community/ui-carto/compare/v1.8.9...v1.8.10) (2021-12-07)

### Bug Fixes

* don't commit lock file ([70fb58f](https://github.com/nativescript-community/ui-carto/commit/70fb58f3d6d6cdf1f24bb138e1781397035a4077))
* download listener fix ([4a11674](https://github.com/nativescript-community/ui-carto/commit/4a1167470c82306b5d94256b67b01cae67cc18e0))
* refactoring and cleanup of the routing services ([40d7c09](https://github.com/nativescript-community/ui-carto/commit/40d7c09278e25a14a0cfc4f10c628a0da617611b))
* submodules remote location ([473a2e8](https://github.com/nativescript-community/ui-carto/commit/473a2e8e8c1c1252a9f3e0947372fd0194fc4e95))
* support for rendererLayerFilter and clickHandlerLayerFilter ([12c133c](https://github.com/nativescript-community/ui-carto/commit/12c133c9d641e61382be87f7a47f93b5d61eec76))

## [1.8.9](https://github.com/nativescript-community/ui-carto/compare/v1.8.8...v1.8.9) (2021-11-25)

### Bug Fixes

* ensure we create the nativeView if not created ([9a56ab1](https://github.com/nativescript-community/ui-carto/commit/9a56ab19ce82bc0d1eca3517498d5c1e8a583d08))

## [1.8.8](https://github.com/nativescript-community/ui-carto/compare/v1.8.7...v1.8.8) (2021-11-25)

### Bug Fixes

* **ios:** typo error on MapPosVector and MapPosVectorVector ([9376ca2](https://github.com/nativescript-community/ui-carto/commit/9376ca2fc2a3b3cae6c603456f782e38820b5db7))
* typings fix ([ba5d68f](https://github.com/nativescript-community/ui-carto/commit/ba5d68fe069282e846e5a105f651a56a5934a065))

## [1.8.7](https://github.com/nativescript-community/ui-carto/compare/v1.8.6...v1.8.7) (2021-11-24)

### Bug Fixes

* allow vector listeners custom native class ([259ddcb](https://github.com/nativescript-community/ui-carto/commit/259ddcb57599c8cc8f923c820e73a70c37345d25))
* **ios:**  VectorElementVector fix ([8b13e98](https://github.com/nativescript-community/ui-carto/commit/8b13e98818d6e144317a181046aa5152673c7503))
* protect against memory leaks ([288bd5c](https://github.com/nativescript-community/ui-carto/commit/288bd5c8fdcd897406944f8d804b0aaa10219040))

## [1.8.6](https://github.com/farfromrefug/nativescript-carto/compare/v1.8.5...v1.8.6) (2021-11-16)

### Bug Fixes

* regression fix ([ec6b7b7](https://github.com/farfromrefug/nativescript-carto/commit/ec6b7b7745e47edac4823dfe7298085d51be609e))

## [1.8.5](https://github.com/farfromrefug/nativescript-carto/compare/v1.8.4...v1.8.5) (2021-11-10)

### Bug Fixes

* fix for circular reference (this time working) ([9f5a986](https://github.com/farfromrefug/nativescript-carto/commit/9f5a9861aec3b1ebaecbe6f7ae4ec808a761a7f7))
* refactor to avoid import circular references ([546852b](https://github.com/farfromrefug/nativescript-carto/commit/546852b939e2d1d8f2e932e8638cd93ea676edeb))
* **android:** native-api-usage optimisation ([177576b](https://github.com/farfromrefug/nativescript-carto/commit/177576babe8c12c95f068bf6dd42ef5a53533bc3))

## [1.8.4](https://github.com/farfromrefug/nativescript-carto/compare/v1.8.3...v1.8.4) (2021-10-15)

### Bug Fixes

* **android:** another cluster fix ([cc6ac56](https://github.com/farfromrefug/nativescript-carto/commit/cc6ac56b83ec54039a234a96119fe380440a9cec))

## [1.8.3](https://github.com/farfromrefug/nativescript-carto/compare/v1.8.2...v1.8.3) (2021-10-15)

### Bug Fixes

* **android:** cluster fix ([0874974](https://github.com/farfromrefug/nativescript-carto/commit/0874974616dfa653d82431d4590fb6cad88841a7))

## [1.8.2](https://github.com/farfromrefug/nativescript-carto/compare/v1.8.1...v1.8.2) (2021-10-15)

### Bug Fixes

* cluster images fix (scale) ([a3934ca](https://github.com/farfromrefug/nativescript-carto/commit/a3934cae28dfb98f825a79288f5893f86de1ccda))
* missing font typing for ClusterElementBuilderOptions ([84dc4cf](https://github.com/farfromrefug/nativescript-carto/commit/84dc4cfbff78278bb5a10f23dde58cb30a67c675))
* prevent error on null image proeprties ([8ba8d92](https://github.com/farfromrefug/nativescript-carto/commit/8ba8d925ca709c0fa5b6b78148e79e8f0e47657b))

## [1.8.1](https://github.com/farfromrefug/nativescript-carto/compare/v1.8.0...v1.8.1) (2021-10-09)

### Features

* ClusteredVectorLayer `expandCluster` ([ac43e41](https://github.com/farfromrefug/nativescript-carto/commit/ac43e41124b8128997bd1d197edf930ce15d211d))

# [1.8.0](https://github.com/farfromrefug/nativescript-carto/compare/v1.7.3...v1.8.0) (2021-10-08)

### Bug Fixes

* **android:** regression fix ([5e36f77](https://github.com/farfromrefug/nativescript-carto/commit/5e36f77732a541bfa1bc3bef3c011c0aef2463a0))

### Features

* cluster support for reporting cluster bbox ([a9e536d](https://github.com/farfromrefug/nativescript-carto/commit/a9e536dd86cbf9981438e5e19b0068d9c62ab703))

## [1.7.3](https://github.com/farfromrefug/nativescript-carto/compare/v1.7.2...v1.7.3) (2021-10-07)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.7.2](https://github.com/farfromrefug/nativescript-carto/compare/v1.7.1...v1.7.2) (2021-10-07)

### Bug Fixes

* fully working clusters ([119dc16](https://github.com/farfromrefug/nativescript-carto/commit/119dc16e8fa83967a8a778441bb198a5587e8b6a))
* LocalVectorLayer addFeatureCollection fix ([48d5fea](https://github.com/farfromrefug/nativescript-carto/commit/48d5fead8d39d2c6efe17ee508b81eb169a374c2))
* use MapRange as array everywhere ([d9adf2b](https://github.com/farfromrefug/nativescript-carto/commit/d9adf2be393f7cced339c381be0ae8c291a6fea8))
* **android:** native-api-usage ([c67b863](https://github.com/farfromrefug/nativescript-carto/commit/c67b863e7e67d9a9760436ecab807b836064c818))
* **ios:** cluster layer in pair with android ([65f5990](https://github.com/farfromrefug/nativescript-carto/commit/65f59901684a8c7b72504f2cca654fab2082d6cf))

## [1.7.1](https://github.com/farfromrefug/nativescript-carto/compare/v1.7.0...v1.7.1) (2021-09-29)

### Bug Fixes

* **ios:** fixed isLocationOnPath and distanceToEnd ([bc61e1b](https://github.com/farfromrefug/nativescript-carto/commit/bc61e1bab2300cfdd3b34d61c5cffc8258122946))
* **ios:** support setRunOnMainThread (true by default) ([db7fde9](https://github.com/farfromrefug/nativescript-carto/commit/db7fde903b7386228404ba5ba46d031cb9d5a7d9))

# [1.7.0](https://github.com/farfromrefug/nativescript-carto/compare/v1.6.4...v1.7.0) (2021-09-27)

### Bug Fixes

* events update ([18c7345](https://github.com/farfromrefug/nativescript-carto/commit/18c73452e99e6c2ab082df2daa26b960b2b5d393))
* **android:** isLocationOnPath fix ([6f205ae](https://github.com/farfromrefug/nativescript-carto/commit/6f205ae17d12e35f7f3803293ca0b96f5e4fa9ad))

### Features

* GeoJSONVectorTileDataSource.setLayerGeoJSONString ([9aef5eb](https://github.com/farfromrefug/nativescript-carto/commit/9aef5eb971bf8d471340604f1375bec5f03abc60))
* GeoJSONVectorTileDataSource.simplifyTolerance ([fcec86d](https://github.com/farfromrefug/nativescript-carto/commit/fcec86d4918a8968173835191a43abe181403fe2))
* Geometry.writeGeometry ([d589f10](https://github.com/farfromrefug/nativescript-carto/commit/d589f1092e86130a0cbf9e221592e8e3f5d5a417))
* **ios:** isLocationOnPath ([a51f8b1](https://github.com/farfromrefug/nativescript-carto/commit/a51f8b173008b41577037f51f54a872403d82496))

## [1.6.4](https://github.com/farfromrefug/nativescript-carto/compare/v1.6.3...v1.6.4) (2021-08-16)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.6.3](https://github.com/farfromrefug/nativescript-carto/compare/v1.6.2...v1.6.3) (2021-08-16)

### Bug Fixes

* update for latest sdk ([a70a592](https://github.com/farfromrefug/nativescript-carto/commit/a70a59230d63da42921803f9b676130ad791c548))
* update to latest native SDK ([e6fa7a6](https://github.com/farfromrefug/nativescript-carto/commit/e6fa7a6b2d0ec0b921e3dd532008623e9686b42d))

## [1.6.2](https://github.com/farfromrefug/nativescript-carto/compare/v1.6.1...v1.6.2) (2021-07-30)

### Bug Fixes

* update ios dep ([737f5f7](https://github.com/farfromrefug/nativescript-carto/commit/737f5f739318175fbc678f371fa6284673af2c9e))
* updated version ([66c36df](https://github.com/farfromrefug/nativescript-carto/commit/66c36df0886d8ede04f21403125b5d33643bb6a3))

## [1.6.1](https://github.com/farfromrefug/nativescript-carto/compare/v1.6.0...v1.6.1) (2021-07-21)

**Note:** Version bump only for package @nativescript-community/ui-carto

# [1.6.0](https://github.com/farfromrefug/nativescript-carto/compare/v1.5.1...v1.6.0) (2021-07-19)

### Bug Fixes

* geocoding autocomplete fix ([8f2a5e5](https://github.com/farfromrefug/nativescript-carto/commit/8f2a5e5942a1e1bc7bbd7f10a7683fb54727cc75))
* marker allow dynamic values change ([cf97f06](https://github.com/farfromrefug/nativescript-carto/commit/cf97f064cc2c9602c16ca6c1e05394cb7c6b7d7c))
* missing refresh signature ([38210be](https://github.com/farfromrefug/nativescript-carto/commit/38210be1a79cb97498a653c19cd774d7bb1aa7d8))
* routing ensure we use the correct profile ([4fcdd42](https://github.com/farfromrefug/nativescript-carto/commit/4fcdd42d5b09804bd466cd4a76a3894f621eebfc))

### Features

* **android:** support for GLTextureView ([1d7838d](https://github.com/farfromrefug/nativescript-carto/commit/1d7838d82eb6d324ad3b2baeb0dd0bb8f7c05ad7))
* borderWidth for text ([c3085dc](https://github.com/farfromrefug/nativescript-carto/commit/c3085dc356cc70fecce7941db82553c20aa5bc86))

## [1.5.1](https://github.com/farfromrefug/nativescript-carto/compare/v1.5.0...v1.5.1) (2021-05-14)

### Bug Fixes

* **ios:** calculateRoute customOptions ([4c13d1b](https://github.com/farfromrefug/nativescript-carto/commit/4c13d1b5b4832522711a1c2d52238990330751b8))
* faster variant from and to ([53a418c](https://github.com/farfromrefug/nativescript-carto/commit/53a418c9d0d8d80d3e2fbbe0525b2e1ae9013685))
* **ios:** findFeatures callback fix ([33bfab2](https://github.com/farfromrefug/nativescript-carto/commit/33bfab2ab1c17433cc66b79503105c166f5038ef))

### Features

* feature as geojson ([a6fd597](https://github.com/farfromrefug/nativescript-carto/commit/a6fd59731726e5a20eb5f82e9dacff58d96d039d))
* maptiler online source ([274f6b8](https://github.com/farfromrefug/nativescript-carto/commit/274f6b8d02a24c30ed727faa44b06b5bd1a01345))

# [1.5.0](https://github.com/farfromrefug/nativescript-carto/compare/v1.4.11...v1.5.0) (2021-04-16)

### Bug Fixes

* getter fix ([d9acc61](https://github.com/farfromrefug/nativescript-carto/commit/d9acc6114132445efc007c1649ec5308e6fbbe56))
* HTTPTileDataSource inheritance ([fd4e37f](https://github.com/farfromrefug/nativescript-carto/commit/fd4e37fb202a9c7c5f34e309154b10daa9056403))
* raster fix ([10e80f5](https://github.com/farfromrefug/nativescript-carto/commit/10e80f59c469bab442b6beb589a20eb8fb953200))
* return colors as Color ([bc41a60](https://github.com/farfromrefug/nativescript-carto/commit/bc41a600baffb4e60adc6fd3e84d3882486a04b6))
* typings fix ([e63c0f9](https://github.com/farfromrefug/nativescript-carto/commit/e63c0f9e59134a117342f519394252b294806930))
* wrong MBTilesTileDataSource parent class ([672289f](https://github.com/farfromrefug/nativescript-carto/commit/672289fa3655caa9f89bba6c601f3ed2d637206f))
* **ios:** missing build flag ([d491e11](https://github.com/farfromrefug/nativescript-carto/commit/d491e118ff885024430d24571cbb638a0bb426c2))

### Features

* loadTile method ([23cb150](https://github.com/farfromrefug/nativescript-carto/commit/23cb150febe045623457db5d90e458abe7aeb0b6))
* map getZoom ([3b497d6](https://github.com/farfromrefug/nativescript-carto/commit/3b497d68422075a91522f2b873c51fabbb4762dd))
* raster layer click ([951e2d0](https://github.com/farfromrefug/nativescript-carto/commit/951e2d03df0073d7d387120215a325ef07d459d9))
* stopAllDownloads ([22e6a96](https://github.com/farfromrefug/nativescript-carto/commit/22e6a967a4ea5f0bfe1bf98f6bd08033c0ddd0ea))

## [1.4.11](https://github.com/farfromrefug/nativescript-carto/compare/v1.4.10...v1.4.11) (2021-01-16)

### Bug Fixes

* prevent errors in production ([dde312f](https://github.com/farfromrefug/nativescript-carto/commit/dde312f5ed6993d3a15fa85f709447eca3e725d0))

## [1.4.10](https://github.com/farfromrefug/nativescript-carto/compare/v1.4.9...v1.4.10) (2021-01-15)

### Bug Fixes

* a lot of fixes and improvements ([c35ecb1](https://github.com/farfromrefug/nativescript-carto/commit/c35ecb112d8c44b11f8471051b2ae64c6bacb526))

## [1.4.9](https://github.com/farfromrefug/nativescript-carto/compare/v1.4.8...v1.4.9) (2020-11-20)

### Bug Fixes

* toJSON for MapBounds ([c52ce64](https://github.com/farfromrefug/nativescript-carto/commit/c52ce6435dd8f7c9e3c690453f8a1c392855c0e3))

### Features

* geometry features ([c818cec](https://github.com/farfromrefug/nativescript-carto/commit/c818cec62e22684e3f860346f73bc4f7744a7b99))

## [1.4.8](https://github.com/farfromrefug/nativescript-carto/compare/v1.4.7...v1.4.8) (2020-11-02)

### Bug Fixes

* features and fixes ([b890450](https://github.com/farfromrefug/nativescript-carto/commit/b890450b8173b84743bc21f0a2a245d98754cb16))

## [1.4.7](https://github.com/farfromrefug/nativescript-carto/compare/v1.4.6...v1.4.7) (2020-10-30)

### Bug Fixes

* prevent error ([47cf1f2](https://github.com/farfromrefug/nativescript-carto/commit/47cf1f26f1365273927a6a94763e63c48d437b92))
* route methods as promise ([3a6f0e0](https://github.com/farfromrefug/nativescript-carto/commit/3a6f0e0f70d54590b9f806ecfba7b05a891aaa75))

## [1.4.6](https://github.com/farfromrefug/nativescript-carto/compare/v1.4.5...v1.4.6) (2020-10-23)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.4.5](https://github.com/farfromrefug/nativescript-carto/compare/v1.4.4...v1.4.5) (2020-10-23)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.4.4](https://github.com/farfromrefug/nativescript-carto/compare/v1.4.3...v1.4.4) (2020-10-23)

### Bug Fixes

* error fix ([bdbaa75](https://github.com/farfromrefug/nativescript-carto/commit/bdbaa75fcee9dbaa3e0e38e4195e56964668f260))

## [1.4.3](https://github.com/farfromrefug/nativescript-carto/compare/v1.4.2...v1.4.3) (2020-09-17)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.4.2](https://github.com/farfromrefug/nativescript-carto/compare/v1.4.1...v1.4.2) (2020-09-17)

### Bug Fixes

* **android:** broken gradle script ([030638d](https://github.com/farfromrefug/nativescript-carto/commit/030638dd8e600b7855ef1abd45cbcf1ddc0c59b0))

## [1.4.1](https://github.com/farfromrefug/nativescript-carto/compare/v1.4.0...v1.4.1) (2020-09-17)

### Bug Fixes

* **ios:** crash fix ([30b7658](https://github.com/farfromrefug/nativescript-carto/commit/30b76585b1c083faafc72f3e7d61a54ea7e0ba94))

# [1.4.0](https://github.com/farfromrefug/nativescript-carto/compare/v1.3.1...v1.4.0) (2020-09-07)

### Bug Fixes

* a lot of fixes! ([0f3a69c](https://github.com/farfromrefug/nativescript-carto/commit/0f3a69ca2a7f8c56c9ba7d89eccd5abdfcb1cf75))
* some fixes ([5b072ea](https://github.com/farfromrefug/nativescript-carto/commit/5b072ea4897ff292f8b42347086310cf31991b4f))

### Features

* N7 and new plugin name ([4da5b91](https://github.com/farfromrefug/nativescript-carto/commit/4da5b91ed09be326ca85d580289c1aa3dad69738))

## [1.3.1](https://github.com/nativescript-community/ui-carto/compare/v1.2.42...v1.3.1) (2020-05-28)

### Bug Fixes

* missing projection methods ([053fc04](https://github.com/nativescript-community/ui-carto/commit/053fc04923c8e297637b68625568a3cceed627cc))

### Features

* added HillshadeRasterTileLayer on android ([8a047e4](https://github.com/nativescript-community/ui-carto/commit/8a047e43d00721292657ce39a93ccf7bc57d1482))
* added PanningMode enum ([27a0d1a](https://github.com/nativescript-community/ui-carto/commit/27a0d1abeba8570acb3f837081a02752fe172153))

## [1.2.42](https://github.com/nativescript-community/ui-carto/compare/v1.2.41...v1.2.42) (2020-05-10)

### Bug Fixes

* **android:** allow overriding version of sdk ([aea2624](https://github.com/nativescript-community/ui-carto/commit/aea26245c1b6b0a057c04dc0fc3e931547ea5838))

## [1.2.41](https://github.com/nativescript-community/ui-carto/compare/v1.2.39...v1.2.41) (2020-05-07)

### Bug Fixes

* rollback and fixes ([43aea9f](https://github.com/nativescript-community/ui-carto/commit/43aea9fc95916a3df45f7805c445410fedf98597))

## [1.2.39](https://github.com/nativescript-community/ui-carto/compare/v1.2.38...v1.2.39) (2020-04-25)

### Bug Fixes

* typo fix ([b72995b](https://github.com/nativescript-community/ui-carto/commit/b72995b612d468589f71524baa3489180b173194))
* **android:** crash on mapListener ([8879eae](https://github.com/nativescript-community/ui-carto/commit/8879eae42c88badf7c04b5c8addb689deabbdd4d))
* prevent crash when no options are passed ([71bb9fe](https://github.com/nativescript-community/ui-carto/commit/71bb9fe8ccfe1620480799f5c03d810d32bb5000))

## [1.2.38](https://github.com/nativescript-community/ui-carto/compare/v1.2.37...v1.2.38) (2020-04-23)

### Bug Fixes

* big bump, move to 4.3.0.RC2 ([72d69a7](https://github.com/nativescript-community/ui-carto/commit/72d69a73fff3cb802f811d476d310e3e05e8fa71))

## [1.2.37](https://github.com/nativescript-community/ui-carto/compare/v1.2.36...v1.2.37) (2019-12-10)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.2.36](https://github.com/nativescript-community/ui-carto/compare/v1.2.35...v1.2.36) (2019-12-09)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.2.35](https://github.com/nativescript-community/ui-carto/compare/v1.2.34...v1.2.35) (2019-12-06)

### Bug Fixes

* typings ([dd0b4e7](https://github.com/nativescript-community/ui-carto/commit/dd0b4e7))

## [1.2.34](https://github.com/nativescript-community/ui-carto/compare/v1.2.33...v1.2.34) (2019-12-05)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.2.33](https://github.com/nativescript-community/ui-carto/compare/v1.2.32...v1.2.33) (2019-11-07)

### Bug Fixes

* updated deps ([e2a10be](https://github.com/nativescript-community/ui-carto/commit/e2a10be))

## [1.2.32](https://github.com/nativescript-community/ui-carto/compare/v1.2.31...v1.2.32) (2019-10-28)

### Bug Fixes

* missing deps ([137c171](https://github.com/nativescript-community/ui-carto/commit/137c171))

## [1.2.31](https://github.com/nativescript-community/ui-carto/compare/v1.2.30...v1.2.31) (2019-10-28)

### Bug Fixes

* some blillboard improvements ([d900d2f](https://github.com/nativescript-community/ui-carto/commit/d900d2f))

## [1.2.30](https://github.com/nativescript-community/ui-carto/compare/v1.2.29...v1.2.30) (2019-10-10)

### Bug Fixes

* inherit content view ([e22599c](https://github.com/nativescript-community/ui-carto/commit/e22599c))

## [1.2.29](https://github.com/nativescript-community/ui-carto/compare/v1.2.28...v1.2.29) (2019-09-27)

### Bug Fixes

* default line elements ignore altitude ([f22cd06](https://github.com/nativescript-community/ui-carto/commit/f22cd06))
* MapbBounds inversed coordinates ([7a72a29](https://github.com/nativescript-community/ui-carto/commit/7a72a29))

## [1.2.28](https://github.com/nativescript-community/ui-carto/compare/v1.2.27...v1.2.28) (2019-08-28)

### Bug Fixes

* prevent styles being loaded twice ([6f6c887](https://github.com/nativescript-community/ui-carto/commit/6f6c887))

### Features

* all debug methods like the sdk ([037f336](https://github.com/nativescript-community/ui-carto/commit/037f336))
* tileSubstitutionPolicy not working yet! ([2811576](https://github.com/nativescript-community/ui-carto/commit/2811576))

## [1.2.27](https://github.com/nativescript-community/ui-carto/compare/v1.2.26...v1.2.27) (2019-08-11)

### Bug Fixes

* better thrown error ([2571723](https://github.com/nativescript-community/ui-carto/commit/2571723))
* trying to improve stylebuilder update ([ab087f5](https://github.com/nativescript-community/ui-carto/commit/ab087f5))

### Features

* captureRendering ([b57d858](https://github.com/nativescript-community/ui-carto/commit/b57d858))

## [1.2.26](https://github.com/nativescript-community/ui-carto/compare/v1.2.25...v1.2.26) (2019-07-30)

### Bug Fixes

* mapBounds is now a class to allow native calls ([899df54](https://github.com/nativescript-community/ui-carto/commit/899df54))
* options.databasePath. Should it work? ([298c804](https://github.com/nativescript-community/ui-carto/commit/298c804))
* setFocusPos fix on iOS ([3a1b155](https://github.com/nativescript-community/ui-carto/commit/3a1b155))

### Features

* added GeoJSONVectorTileDataSource ([21e1593](https://github.com/nativescript-community/ui-carto/commit/21e1593))

## [1.2.25](https://github.com/nativescript-community/ui-carto/compare/v1.2.24...v1.2.25) (2019-07-25)

### Bug Fixes

* ios datasource add crash ([9f391db](https://github.com/nativescript-community/ui-carto/commit/9f391db))

## [1.2.24](https://github.com/nativescript-community/ui-carto/compare/v1.2.23...v1.2.24) (2019-07-24)

### Bug Fixes

* no  android typings ([fb4b986](https://github.com/nativescript-community/ui-carto/commit/fb4b986))

## [1.2.23](https://github.com/nativescript-community/ui-carto/compare/v1.2.22...v1.2.23) (2019-07-24)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.2.22](https://github.com/nativescript-community/ui-carto/compare/v1.2.21...v1.2.22) (2019-07-19)

### Bug Fixes

* cleanup on dispose ([34cb78b](https://github.com/nativescript-community/ui-carto/commit/34cb78b))
* cluster improvements ([926c05c](https://github.com/nativescript-community/ui-carto/commit/926c05c))

## [1.2.21](https://github.com/nativescript-community/ui-carto/compare/v1.2.20...v1.2.21) (2019-06-13)

### Bug Fixes

* new version support no license ([8dc7ced](https://github.com/nativescript-community/ui-carto/commit/8dc7ced))
* removed polutating logs ([0421dff](https://github.com/nativescript-community/ui-carto/commit/0421dff))

## [1.2.20](https://github.com/nativescript-community/ui-carto/compare/v1.2.19...v1.2.20) (2019-06-11)

### Bug Fixes

* better handle off android enum properties ([267c26a](https://github.com/nativescript-community/ui-carto/commit/267c26a))
* fixed joinType and endType properties ([5f0e655](https://github.com/nativescript-community/ui-carto/commit/5f0e655))
* import fixes ([a49ea72](https://github.com/nativescript-community/ui-carto/commit/a49ea72))
* metaData type ([e72c92e](https://github.com/nativescript-community/ui-carto/commit/e72c92e))
* prevent NPE error ([5ba6d27](https://github.com/nativescript-community/ui-carto/commit/5ba6d27))

### Features

* allow to use custom keys for MapPos objects ([031c219](https://github.com/nativescript-community/ui-carto/commit/031c219))
* toArray for MapPosVector ([72156e6](https://github.com/nativescript-community/ui-carto/commit/72156e6))

## [1.2.19](https://github.com/nativescript-community/ui-carto/compare/v1.2.18...v1.2.19) (2019-05-31)

### Features

* getLayers support ([aee0683](https://github.com/nativescript-community/ui-carto/commit/aee0683))

## [1.2.18](https://github.com/nativescript-community/ui-carto/compare/v1.2.17...v1.2.18) (2019-05-31)

### Bug Fixes

* better signatture for setZoom and setMapRotation ([376d9aa](https://github.com/nativescript-community/ui-carto/commit/376d9aa))
* do not initialize some options ([f2db797](https://github.com/nativescript-community/ui-carto/commit/f2db797))

### Features

* report userAction on mapMoved and idle. Allows userFollow logic ([66e67ec](https://github.com/nativescript-community/ui-carto/commit/66e67ec))
* report when a map move was triggered by the user ([b4d14d5](https://github.com/nativescript-community/ui-carto/commit/b4d14d5))
* reverse geocoding ([bc1edde](https://github.com/nativescript-community/ui-carto/commit/bc1edde))

## [1.2.17](https://github.com/nativescript-community/ui-carto/compare/v1.2.16...v1.2.17) (2019-05-28)

### Bug Fixes

* ios valhalla implementation ([cb2c9c1](https://github.com/nativescript-community/ui-carto/commit/cb2c9c1))
* wrong Line inheritance (preventing properties to work) ([d939406](https://github.com/nativescript-community/ui-carto/commit/d939406))

### Features

* route matching ([ddf85b9](https://github.com/nativescript-community/ui-carto/commit/ddf85b9))

## [1.2.16](https://github.com/nativescript-community/ui-carto/compare/v1.2.15...v1.2.16) (2019-05-27)

### Bug Fixes

* wrong options declarations for LineStyleBuilder ([f4ff4d1](https://github.com/nativescript-community/ui-carto/commit/f4ff4d1))

## [1.2.15](https://github.com/nativescript-community/ui-carto/compare/v1.2.14...v1.2.15) (2019-05-27)

### Features

* valhalla routing support ([cd2df9a](https://github.com/nativescript-community/ui-carto/commit/cd2df9a))

## [1.2.14](https://github.com/nativescript-community/ui-carto/compare/v1.2.13...v1.2.14) (2019-05-27)

### Bug Fixes

* android fix missing apiKey argument ([f1ca362](https://github.com/nativescript-community/ui-carto/commit/f1ca362))
* better map options ([db8a1b4](https://github.com/nativescript-community/ui-carto/commit/db8a1b4))
* refactoring vector elements and added more native properties ([acd0332](https://github.com/nativescript-community/ui-carto/commit/acd0332))

### Features

* added FeatureCollectionSearchService ([4a6822b](https://github.com/nativescript-community/ui-carto/commit/4a6822b))
* added routing ([9ef9e8c](https://github.com/nativescript-community/ui-carto/commit/9ef9e8c))
* geocoding services for ios ([2936f3f](https://github.com/nativescript-community/ui-carto/commit/2936f3f))
* more methods to convert native carto objects ([0890279](https://github.com/nativescript-community/ui-carto/commit/0890279))
* more methods to convert native carto objects ([c8af6fc](https://github.com/nativescript-community/ui-carto/commit/c8af6fc))

## [1.2.13](https://github.com/nativescript-community/ui-carto/compare/v1.2.12...v1.2.13) (2019-05-24)

### Bug Fixes

* no need to convert to Wgs84 ([65b1347](https://github.com/nativescript-community/ui-carto/commit/65b1347))
* null check ([48a3f79](https://github.com/nativescript-community/ui-carto/commit/48a3f79))
* zip loading fix in MBVectorTileDecoder on android ([1a1abce](https://github.com/nativescript-community/ui-carto/commit/1a1abce))

### Features

* support passing native  objects ([770c5e1](https://github.com/nativescript-community/ui-carto/commit/770c5e1))

## [1.2.12](https://github.com/nativescript-community/ui-carto/compare/v1.2.11...v1.2.12) (2019-05-17)

### Bug Fixes

* ios MBVectorTileDecoder ([4aa90d8](https://github.com/nativescript-community/ui-carto/commit/4aa90d8))
* ios VectorTileRenderOrder ([6d5dfe7](https://github.com/nativescript-community/ui-carto/commit/6d5dfe7))

### Features

* ios MergedMBVTTileDataSource ([62a64e1](https://github.com/nativescript-community/ui-carto/commit/62a64e1))
* ios NTDirAssetPackageImpl ([bbae91e](https://github.com/nativescript-community/ui-carto/commit/bbae91e))

## [1.2.11](https://github.com/nativescript-community/ui-carto/compare/v1.2.10...v1.2.11) (2019-05-02)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.2.10](https://github.com/nativescript-community/ui-carto/compare/1.2.9...1.2.10) (2019-05-02)

### Features

* layer get datasource and projection for ios ([c84f6f5](https://github.com/nativescript-community/ui-carto/commit/c84f6f5))

### Changelog

All notable changes to this project will be documented in this file. Dates are displayed in UTC.

Generated by [`auto-changelog`](https://github.com/CookPete/auto-changelog).

#### 1.2.8

> 10 April 2019

- big bump. Update to latest sdk [`e6677ff`](https://github.com/nativescript-community/ui-carto/commit/e6677ffe0f3f63838fe149d7d418deea7e396eef)
- first version [`dba74db`](https://github.com/nativescript-community/ui-carto/commit/dba74db9d3b1131cceb4fb6a84761cde34a2d409)
- bump [`fc8a7e3`](https://github.com/nativescript-community/ui-carto/commit/fc8a7e32441342ec38dee8887a535dfb9d8f0e2b)

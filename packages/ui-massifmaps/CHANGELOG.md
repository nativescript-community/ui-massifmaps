# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.1](https://github.com/nativescript-community/ui-massifmaps/compare/v4.0.0...v4.0.1) (2026-10-19)

**Note:** Version bump only for package @nativescript-community/ui-massifmaps

## [4.0.0](https://github.com/nativescript-community/ui-massifmaps/compare/v3.0.1...v4.0.0) (2026-10-09)

### ⚠ BREAKING CHANGES

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

* **api:** add onCelestialClick for the celestial.clicked event ([7c1a540](https://github.com/nativescript-community/ui-massifmaps/commit/7c1a5407c03f02eeeaad8cac172ad31de5ce674b))
* **api:** build the plugin on the SDK's surface API ([a6accd3](https://github.com/nativescript-community/ui-massifmaps/commit/a6accd31c2064236a9b76c03c93cb5a46bc07598)), closes [massif-maps/MassifMaps#146](https://github.com/massif-maps/MassifMaps/issues/146) [#159](https://github.com/nativescript-community/ui-massifmaps/issues/159)
* **api:** style parameters, aliases and one-crossing writes ([eb9aa7c](https://github.com/nativescript-community/ui-massifmaps/commit/eb9aa7c7f31c902d1191ab694d3d0003c2a93d97))
* take the map's events from the surface API, and delete the native listener ([657562a](https://github.com/nativescript-community/ui-massifmaps/commit/657562a24023778a35c45669cbdb3c8b86d85abc))
* take the map's move reason from the SDK, and type every map event ([cc49474](https://github.com/nativescript-community/ui-massifmaps/commit/cc49474b034567ddf722c7655f1b1a36e60c48b2))

### Bug Fixes

* **bindings:** keep every class a facade call touches in the Android metadata ([eab0123](https://github.com/nativescript-community/ui-massifmaps/commit/eab0123f1bcd6b85b6576e805c093c0f097c7022))
* **ios:** link OpenGLES and GLKit only outside Mac Catalyst ([6c65478](https://github.com/nativescript-community/ui-massifmaps/commit/6c6547895cbe187e6cc22692c23281e7f56bbc94))

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

* generate native bindings from the ambient typings ([0fe2b62](https://github.com/nativescript-community/ui-massifmaps/commit/0fe2b62c79e0e3bb59cadc6a551fcbd97d54d8cd))
* rename plugin to ui-massifmaps ([33b1661](https://github.com/nativescript-community/ui-massifmaps/commit/33b1661777cd477af29910ef5f0fad3fc6e2625b))

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

**Note:** Version bump only for package @nativescript-community/ui-carto

## [2.0.3](https://github.com/nativescript-community/ui-carto/compare/v2.0.2...v2.0.3) (2026-01-20)

### Bug Fixes

* **ios:** build fix ([13d7b5e](https://github.com/nativescript-community/ui-carto/commit/13d7b5e9e5509e48a1328a9af6654dc6db065489))

## [2.0.2](https://github.com/nativescript-community/ui-carto/compare/v2.0.1...v2.0.2) (2026-01-20)

### Bug Fixes

* **ios:** Update carto-mobile-sdk version to 5.0.1 ([579eb11](https://github.com/nativescript-community/ui-carto/commit/579eb11689857c5976a0011d36acc12fd92f5ca1))

## [2.0.1](https://github.com/nativescript-community/ui-carto/compare/v2.0.0...v2.0.1) (2026-01-14)

### Bug Fixes

* added synchronous handler timeout to prevent deadlock ([712c83b](https://github.com/nativescript-community/ui-carto/commit/712c83b53e101b860ac48866eb150be20e5e7f10))
* **android:** build fix ([e18cd3b](https://github.com/nativescript-community/ui-carto/commit/e18cd3b3feff0434d95fdd64664331b5c3c84f5d))
* **android:** you can now set version with cartoSDKVersion but also change variant with cartoSDKVariant. You can use lite/standard which are smaller builds than the default one. But you loose some features like rooting, geocoding ... ([0de72fd](https://github.com/nativescript-community/ui-carto/commit/0de72fd8eeebef4dbdd63862eb588cd9961d0aad))

## [2.0.0](https://github.com/nativescript-community/ui-carto/compare/v1.8.21...v2.0.0) (2025-10-15)

### Features

* using latest sdk and available native SDK on iOS and Android ([e3bb8b2](https://github.com/nativescript-community/ui-carto/commit/e3bb8b2d2d840426ae80ddd024c77a4f747ac755))

### Bug Fixes

* **ios:** many fixes around search/routing ([e892540](https://github.com/nativescript-community/ui-carto/commit/e892540209a3086f9294e0bb85e6091a010b0c41))
* **ios:** utils fix ([773cfc7](https://github.com/nativescript-community/ui-carto/commit/773cfc7251d15ec1e3bc7adacbc5c88db24792c5))

## [1.8.21](https://github.com/nativescript-community/ui-carto/compare/v1.8.20...v1.8.21) (2025-07-15)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.8.20](https://github.com/nativescript-community/ui-carto/compare/v1.8.19...v1.8.20) (2025-07-15)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.8.19](https://github.com/nativescript-community/ui-carto/compare/v1.8.12-alpha.2...v1.8.19) (2025-07-15)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.8.12-alpha.2](https://github.com/nativescript-community/ui-carto/compare/v1.8.12-alpha.1...v1.8.12-alpha.2) (2025-07-15)

### Bug Fixes

* improved isLocationOnPath ([c0ba1b8](https://github.com/nativescript-community/ui-carto/commit/c0ba1b80a09c7a5391a273a2fed50250157010ab))

## [1.8.12-alpha.1](https://github.com/nativescript-community/ui-carto/compare/v1.8.12-alpha.0...v1.8.12-alpha.1) (2025-06-16)

### Reverts

* Revert "chore: test release" ([da7a61f](https://github.com/nativescript-community/ui-carto/commit/da7a61fb21fb892416ce58ca8e85a6760be62593))

## [1.8.12-alpha.0](https://github.com/nativescript-community/ui-carto/compare/v1.8.11...v1.8.12-alpha.0) (2025-01-29)

### Features

* in pair features between iOS and Android ([6b1f5ca](https://github.com/nativescript-community/ui-carto/commit/6b1f5caf8dc457ad3074f7d414cbbddbd223e0c0))
* onMapInteraction ([abe38dd](https://github.com/nativescript-community/ui-carto/commit/abe38dde28555a337db6b6aed3c482ea77e52564))

### Bug Fixes

* added all new features from latest sdk ([5408477](https://github.com/nativescript-community/ui-carto/commit/5408477cb61b844e05ece1d1da50d1dafd0030aa))
* **android:** correctly pause resume map ([c919930](https://github.com/nativescript-community/ui-carto/commit/c919930f02515745fe7ec182ee695a0776eed001))
* refactoring and cleanup of the routing services ([58e5052](https://github.com/nativescript-community/ui-carto/commit/58e5052db2d0113c4cf4ca47f74d3b4487650805))
* support new valhalla addLocale ([80417a7](https://github.com/nativescript-community/ui-carto/commit/80417a78f5f46efd75bd539f974c8b01e6a06a92))

## [1.8.11](https://github.com/nativescript-community/ui-carto/compare/v1.8.10...v1.8.11) (2022-01-20)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.8.10](https://github.com/nativescript-community/ui-carto/compare/v1.8.9...v1.8.10) (2021-12-07)

### Bug Fixes

* refactoring and cleanup of the routing services ([40d7c09](https://github.com/nativescript-community/ui-carto/commit/40d7c09278e25a14a0cfc4f10c628a0da617611b))

## [1.8.9](https://github.com/nativescript-community/ui-carto/compare/v1.8.8...v1.8.9) (2021-11-25)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.8.8](https://github.com/nativescript-community/ui-carto/compare/v1.8.7...v1.8.8) (2021-11-25)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.8.7](https://github.com/nativescript-community/ui-carto/compare/v1.8.6...v1.8.7) (2021-11-24)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.8.6](https://github.com/nativescript-community/ui-carto/compare/v1.8.5...v1.8.6) (2021-11-16)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.8.5](https://github.com/nativescript-community/ui-carto/compare/v1.8.4...v1.8.5) (2021-11-10)

### Bug Fixes

* **android:** native-api-usage optimisation ([177576b](https://github.com/nativescript-community/ui-carto/commit/177576babe8c12c95f068bf6dd42ef5a53533bc3))

## [1.8.4](https://github.com/nativescript-community/ui-carto/compare/v1.8.3...v1.8.4) (2021-10-15)

### Bug Fixes

* **android:** another cluster fix ([cc6ac56](https://github.com/nativescript-community/ui-carto/commit/cc6ac56b83ec54039a234a96119fe380440a9cec))

## [1.8.3](https://github.com/nativescript-community/ui-carto/compare/v1.8.2...v1.8.3) (2021-10-15)

### Bug Fixes

* **android:** cluster fix ([0874974](https://github.com/nativescript-community/ui-carto/commit/0874974616dfa653d82431d4590fb6cad88841a7))

## [1.8.2](https://github.com/nativescript-community/ui-carto/compare/v1.8.1...v1.8.2) (2021-10-15)

### Bug Fixes

* cluster images fix (scale) ([a3934ca](https://github.com/nativescript-community/ui-carto/commit/a3934cae28dfb98f825a79288f5893f86de1ccda))

## [1.8.1](https://github.com/nativescript-community/ui-carto/compare/v1.8.0...v1.8.1) (2021-10-09)

**Note:** Version bump only for package @nativescript-community/ui-carto

# [1.8.0](https://github.com/nativescript-community/ui-carto/compare/v1.7.3...v1.8.0) (2021-10-08)

### Features

* cluster support for reporting cluster bbox ([a9e536d](https://github.com/nativescript-community/ui-carto/commit/a9e536dd86cbf9981438e5e19b0068d9c62ab703))

## [1.7.3](https://github.com/nativescript-community/ui-carto/compare/v1.7.2...v1.7.3) (2021-10-07)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.7.2](https://github.com/nativescript-community/ui-carto/compare/v1.7.1...v1.7.2) (2021-10-07)

### Bug Fixes

* fully working clusters ([119dc16](https://github.com/nativescript-community/ui-carto/commit/119dc16e8fa83967a8a778441bb198a5587e8b6a))
* **android:** native-api-usage ([c67b863](https://github.com/nativescript-community/ui-carto/commit/c67b863e7e67d9a9760436ecab807b836064c818))
* **ios:** cluster layer in pair with android ([65f5990](https://github.com/nativescript-community/ui-carto/commit/65f59901684a8c7b72504f2cca654fab2082d6cf))

## [1.7.1](https://github.com/nativescript-community/ui-carto/compare/v1.7.0...v1.7.1) (2021-09-29)

**Note:** Version bump only for package @nativescript-community/ui-carto

# [1.7.0](https://github.com/nativescript-community/ui-carto/compare/v1.6.4...v1.7.0) (2021-09-27)

### Bug Fixes

* **android:** isLocationOnPath fix ([6f205ae](https://github.com/nativescript-community/ui-carto/commit/6f205ae17d12e35f7f3803293ca0b96f5e4fa9ad))

### Features

* **ios:** isLocationOnPath ([a51f8b1](https://github.com/nativescript-community/ui-carto/commit/a51f8b173008b41577037f51f54a872403d82496))

## [1.6.4](https://github.com/nativescript-community/ui-carto/compare/v1.6.3...v1.6.4) (2021-08-16)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.6.3](https://github.com/nativescript-community/ui-carto/compare/v1.6.2...v1.6.3) (2021-08-16)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.6.2](https://github.com/nativescript-community/ui-carto/compare/v1.6.1...v1.6.2) (2021-07-30)

### Bug Fixes

* update ios dep ([737f5f7](https://github.com/nativescript-community/ui-carto/commit/737f5f739318175fbc678f371fa6284673af2c9e))
* updated version ([66c36df](https://github.com/nativescript-community/ui-carto/commit/66c36df0886d8ede04f21403125b5d33643bb6a3))

## [1.6.1](https://github.com/nativescript-community/ui-carto/compare/v1.6.0...v1.6.1) (2021-07-21)

**Note:** Version bump only for package @nativescript-community/ui-carto

# [1.6.0](https://github.com/nativescript-community/ui-carto/compare/v1.5.1...v1.6.0) (2021-07-19)

### Features

* **android:** support for GLTextureView ([1d7838d](https://github.com/nativescript-community/ui-carto/commit/1d7838d82eb6d324ad3b2baeb0dd0bb8f7c05ad7))

## [1.5.1](https://github.com/nativescript-community/ui-carto/compare/v1.5.0...v1.5.1) (2021-05-14)

**Note:** Version bump only for package @nativescript-community/ui-carto

# [1.5.0](https://github.com/nativescript-community/ui-carto/compare/v1.4.11...v1.5.0) (2021-04-16)

### Bug Fixes

* **ios:** missing build flag ([d491e11](https://github.com/nativescript-community/ui-carto/commit/d491e118ff885024430d24571cbb638a0bb426c2))

### Features

* raster layer click ([951e2d0](https://github.com/nativescript-community/ui-carto/commit/951e2d03df0073d7d387120215a325ef07d459d9))

## [1.4.11](https://github.com/nativescript-community/ui-carto/compare/v1.4.10...v1.4.11) (2021-01-16)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.4.10](https://github.com/nativescript-community/ui-carto/compare/v1.4.9...v1.4.10) (2021-01-15)

### Bug Fixes

* a lot of fixes and improvements ([c35ecb1](https://github.com/nativescript-community/ui-carto/commit/c35ecb112d8c44b11f8471051b2ae64c6bacb526))

## [1.4.9](https://github.com/farfromrefug/nativescript-carto/compare/v1.4.8...v1.4.9) (2020-11-20)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.4.8](https://github.com/farfromrefug/nativescript-carto/compare/v1.4.7...v1.4.8) (2020-11-02)

### Bug Fixes

* features and fixes ([b890450](https://github.com/farfromrefug/nativescript-carto/commit/b890450b8173b84743bc21f0a2a245d98754cb16))

## [1.4.7](https://github.com/farfromrefug/nativescript-carto/compare/v1.4.6...v1.4.7) (2020-10-30)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.4.6](https://github.com/farfromrefug/nativescript-carto/compare/v1.4.5...v1.4.6) (2020-10-23)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.4.5](https://github.com/farfromrefug/nativescript-carto/compare/v1.4.4...v1.4.5) (2020-10-23)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.4.4](https://github.com/farfromrefug/nativescript-carto/compare/v1.4.3...v1.4.4) (2020-10-23)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.4.3](https://github.com/farfromrefug/nativescript-carto/compare/v1.4.2...v1.4.3) (2020-09-17)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.4.2](https://github.com/farfromrefug/nativescript-carto/compare/v1.4.1...v1.4.2) (2020-09-17)

### Bug Fixes

* **android:** broken gradle script ([030638d](https://github.com/farfromrefug/nativescript-carto/commit/030638dd8e600b7855ef1abd45cbcf1ddc0c59b0))

## [1.4.1](https://github.com/farfromrefug/nativescript-carto/compare/v1.4.0...v1.4.1) (2020-09-17)

**Note:** Version bump only for package @nativescript-community/ui-carto

# [1.4.0](https://github.com/farfromrefug/nativescript-carto/compare/v1.3.1...v1.4.0) (2020-09-07)

### Features

* N7 and new plugin name ([4da5b91](https://github.com/farfromrefug/nativescript-carto/commit/4da5b91ed09be326ca85d580289c1aa3dad69738))

## [1.3.1](https://github.com/nativescript-community/ui-carto/compare/v1.2.42...v1.3.1) (2020-05-28)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.2.42](https://github.com/nativescript-community/ui-carto/compare/v1.2.41...v1.2.42) (2020-05-10)

### Bug Fixes

* **android:** allow overriding version of sdk ([aea2624](https://github.com/nativescript-community/ui-carto/commit/aea26245c1b6b0a057c04dc0fc3e931547ea5838))

## [1.2.41](https://github.com/nativescript-community/ui-carto/compare/v1.2.39...v1.2.41) (2020-05-07)

### Bug Fixes

* rollback and fixes ([43aea9f](https://github.com/nativescript-community/ui-carto/commit/43aea9fc95916a3df45f7805c445410fedf98597))

## [1.2.39](https://github.com/nativescript-community/ui-carto/compare/v1.2.38...v1.2.39) (2020-04-25)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.2.38](https://github.com/nativescript-community/ui-carto/compare/v1.2.37...v1.2.38) (2020-04-23)

### Bug Fixes

* big bump, move to 4.3.0.RC2 ([72d69a7](https://github.com/nativescript-community/ui-carto/commit/72d69a73fff3cb802f811d476d310e3e05e8fa71))

## [1.2.37](https://github.com/nativescript-community/ui-carto/compare/v1.2.36...v1.2.37) (2019-12-10)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.2.36](https://github.com/nativescript-community/ui-carto/compare/v1.2.35...v1.2.36) (2019-12-09)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.2.35](https://github.com/nativescript-community/ui-carto/compare/v1.2.34...v1.2.35) (2019-12-06)

**Note:** Version bump only for package @nativescript-community/ui-carto

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

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.2.29](https://github.com/nativescript-community/ui-carto/compare/v1.2.28...v1.2.29) (2019-09-27)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.2.28](https://github.com/nativescript-community/ui-carto/compare/v1.2.27...v1.2.28) (2019-08-28)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.2.27](https://github.com/nativescript-community/ui-carto/compare/v1.2.26...v1.2.27) (2019-08-11)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.2.26](https://github.com/nativescript-community/ui-carto/compare/v1.2.25...v1.2.26) (2019-07-30)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.2.25](https://github.com/nativescript-community/ui-carto/compare/v1.2.24...v1.2.25) (2019-07-25)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.2.24](https://github.com/nativescript-community/ui-carto/compare/v1.2.23...v1.2.24) (2019-07-24)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.2.23](https://github.com/nativescript-community/ui-carto/compare/v1.2.22...v1.2.23) (2019-07-24)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.2.22](https://github.com/nativescript-community/ui-carto/compare/v1.2.21...v1.2.22) (2019-07-19)

### Bug Fixes

* cluster improvements ([926c05c](https://github.com/nativescript-community/ui-carto/commit/926c05c))

## [1.2.21](https://github.com/nativescript-community/ui-carto/compare/v1.2.20...v1.2.21) (2019-06-13)

### Bug Fixes

* new version support no license ([8dc7ced](https://github.com/nativescript-community/ui-carto/commit/8dc7ced))

## [1.2.20](https://github.com/nativescript-community/ui-carto/compare/v1.2.19...v1.2.20) (2019-06-11)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.2.19](https://github.com/nativescript-community/ui-carto/compare/v1.2.18...v1.2.19) (2019-05-31)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.2.18](https://github.com/nativescript-community/ui-carto/compare/v1.2.17...v1.2.18) (2019-05-31)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.2.17](https://github.com/nativescript-community/ui-carto/compare/v1.2.16...v1.2.17) (2019-05-28)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.2.16](https://github.com/nativescript-community/ui-carto/compare/v1.2.15...v1.2.16) (2019-05-27)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.2.15](https://github.com/nativescript-community/ui-carto/compare/v1.2.14...v1.2.15) (2019-05-27)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.2.14](https://github.com/nativescript-community/ui-carto/compare/v1.2.13...v1.2.14) (2019-05-27)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.2.13](https://github.com/nativescript-community/ui-carto/compare/v1.2.12...v1.2.13) (2019-05-24)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.2.12](https://github.com/nativescript-community/ui-carto/compare/v1.2.11...v1.2.12) (2019-05-17)

**Note:** Version bump only for package @nativescript-community/ui-carto

## [1.2.11](https://github.com/nativescript-community/ui-carto/compare/v1.2.10...v1.2.11) (2019-05-02)

**Note:** Version bump only for package @nativescript-community/ui-carto

## 1.2.10 (2019-05-02)

## 1.2.9 (2019-04-10)

## 1.2.8 (2019-04-10)

**Note:** Version bump only for package @nativescript-community/ui-carto

### Changelog

All notable changes to this project will be documented in this file. Dates are displayed in UTC.

Generated by [`auto-changelog`](https://github.com/CookPete/auto-changelog).

#### 1.2.8

> 10 April 2019

- big bump. Update to latest sdk [`e6677ff`](https://github.com/nativescript-community/ui-carto/commit/e6677ffe0f3f63838fe149d7d418deea7e396eef)
- first version [`dba74db`](https://github.com/nativescript-community/ui-carto/commit/dba74db9d3b1131cceb4fb6a84761cde34a2d409)
- bump [`fc8a7e3`](https://github.com/nativescript-community/ui-carto/commit/fc8a7e32441342ec38dee8887a535dfb9d8f0e2b)
- bump [`753fab4`](https://github.com/nativescript-community/ui-carto/commit/753fab4f32b9d15afab227b51f5c5680cf9ee1a2)
- big bump again [`b3a35da`](https://github.com/nativescript-community/ui-carto/commit/b3a35dad274d5b66429a5a8bdf923d978d28db47)
- big bump [`9194305`](https://github.com/nativescript-community/ui-carto/commit/9194305d3145cba7cf8a4b56496519ee405f340e)
- trying pnpm [`923764f`](https://github.com/nativescript-community/ui-carto/commit/923764f611d874dc1ccfaf14f7eb8b6891d32078)
- refactoring [`40c4533`](https://github.com/nativescript-community/ui-carto/commit/40c4533aa55e2a3d866ca8b6bdd3473d04468b0e)
- big bump [`380edcf`](https://github.com/nativescript-community/ui-carto/commit/380edcf93dd0c65cf78b8eb6100c74d20124e819)
- big bump [`34e12a4`](https://github.com/nativescript-community/ui-carto/commit/34e12a4cc99811ba2cd292e106715963009cecdc)
- update [`cca5766`](https://github.com/nativescript-community/ui-carto/commit/cca5766656ef0c5c03219f123bc5cc7d7786a2e3)
- bump [`26353d1`](https://github.com/nativescript-community/ui-carto/commit/26353d18b499f9e4d8185946424472a83e06ff70)
- a lot of fixes [`f1a02da`](https://github.com/nativescript-community/ui-carto/commit/f1a02dafd5c4488fc5e26ddd9ac67ae4c3b558b5)
- update ignores [`42e1ca6`](https://github.com/nativescript-community/ui-carto/commit/42e1ca6a87820d8f23f5f0b23522a1797900829e)
- untrack [`554260f`](https://github.com/nativescript-community/ui-carto/commit/554260f7404038fdc01fe8bc3ebf64942de97cfe)
- bump [`aaf11d5`](https://github.com/nativescript-community/ui-carto/commit/aaf11d5394253b690c711eda41b2ff7d7342be27)
- bump [`b5f03d3`](https://github.com/nativescript-community/ui-carto/commit/b5f03d3f4f794bd36933d912b00357de92af08a2)
- cleanup [`51680d4`](https://github.com/nativescript-community/ui-carto/commit/51680d4bb11800134f88b98a0e92295d5094c10c)
- cleanup [`48882bb`](https://github.com/nativescript-community/ui-carto/commit/48882bbb979c191193fe35d2c7bb364f26996fbd)
- native [`b894763`](https://github.com/nativescript-community/ui-carto/commit/b894763c68a547240787694c6a281bd094fececb)
- oups! [`40ac65e`](https://github.com/nativescript-community/ui-carto/commit/40ac65ee0d2d3bcac0a8458e0e4c01f668251d6a)
- refactoring [`de0423c`](https://github.com/nativescript-community/ui-carto/commit/de0423cc8956388ffab8eadb785e30a0b2495cd6)
- bump [`7dbaffb`](https://github.com/nativescript-community/ui-carto/commit/7dbaffb0f549e774d438b070cf91f7a332e4a826)
- import exports fixes [`c7af85f`](https://github.com/nativescript-community/ui-carto/commit/c7af85f6a3b68c30c95b36d55ca31fa3240be352)
- should be commited [`20ee7a1`](https://github.com/nativescript-community/ui-carto/commit/20ee7a191aa3b1267f88f5f1f929b1b4225bcc4f)
- cluster [`54ded61`](https://github.com/nativescript-community/ui-carto/commit/54ded61a28a22028e32a6aa6df90123ec8f10c5a)
- ignores [`16a1ef9`](https://github.com/nativescript-community/ui-carto/commit/16a1ef904529be2f570930b371d221cc3acbd679)
- new npm package [`c739326`](https://github.com/nativescript-community/ui-carto/commit/c739326fd83c07773734f16ccb1d0899e1a60164)
- npm ignores [`9916e8a`](https://github.com/nativescript-community/ui-carto/commit/9916e8a33bfe1c52db8b628f0119ddd17042bcb7)
- ignore [`903d736`](https://github.com/nativescript-community/ui-carto/commit/903d736d9d9939daa7c2d4687f62fdface0b69a9)
- git ignore [`e35431a`](https://github.com/nativescript-community/ui-carto/commit/e35431ac3f5834eeeb6ac6094f55d97fe460741b)
- Removing CartoMobileSDK from git history [`b4c6399`](https://github.com/nativescript-community/ui-carto/commit/b4c6399ab1f3ce70d955b78f8548c9e8230e7a18)
- updated sdk [`73b302f`](https://github.com/nativescript-community/ui-carto/commit/73b302f66016a83a84bc940a954837342173c42c)
- ignores [`fb6a334`](https://github.com/nativescript-community/ui-carto/commit/fb6a334c7ec409395579a92a7b9ece55e03bc017)
- Release 1.2.8 [`81ac8bc`](https://github.com/nativescript-community/ui-carto/commit/81ac8bcc0c9428d9960985fe4cb630cfdcdcffa8)
- ignore [`0a4945b`](https://github.com/nativescript-community/ui-carto/commit/0a4945b5bc6ccc3fdc6147cef158832b29fab276)
- cleanup [`0348300`](https://github.com/nativescript-community/ui-carto/commit/0348300fac38cd298750784ba61b3fd9632a7bfc)

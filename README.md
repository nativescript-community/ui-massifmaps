<!-- ⚠️ This README has been generated from the file(s) "blueprint.md" ⚠️--><!-- ⚠️ This README has been generated from the file(s) "blueprint.md" ⚠️-->
<!--  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      DO NOT EDIT THIS READEME DIRECTLY! Edit "bluesprint.md" instead.
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
<h1 align="center">@nativescript-community/ui-massifmaps</h1>
<p align="center">
		<a href="https://npmcharts.com/compare/@nativescript-community/ui-massifmaps?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/@nativescript-community/ui-massifmaps.svg" height="20"/></a>
<a href="https://www.npmjs.com/package/@nativescript-community/ui-massifmaps"><img alt="NPM Version" src="https://img.shields.io/npm/v/@nativescript-community/ui-massifmaps.svg" height="20"/></a>
	</p>

<p align="center">
  <b>NativeScript plugin for MassifMaps SDK</b></br>
  <sub><sub>
</p>

<br />



[](#table-of-contents)


[](#table-of-contents)

## Table of Contents

* [Installation](#installation)
* [API](#api)
* [The surface API](#the-surface-api)
	* [Getting a map](#getting-a-map)
	* [Layers and sources are specs](#layers-and-sources-are-specs)
	* [Properties](#properties)
	* [The camera](#the-camera)
	* [Events are Observable events](#events-are-observable-events)
	* [Methods](#methods)
	* [Routing](#routing)
	* [Moving over a piece at a time](#moving-over-a-piece-at-a-time)
	* [Typings](#typings)
	* [Requirements and known gaps](#requirements-and-known-gaps)
* [The example gallery](#the-example-gallery)
* [Usage in Svelte](#usage-in-svelte)
	* [Examples](#examples)
* [Usage in Vue](#usage-in-vue)
	* [Examples](#examples-1)
* [Demos and Development](#demos-and-development)
	* [Repo Setup](#repo-setup)
	* [Build](#build)
	* [Demos](#demos)
* [Contributing](#contributing)
	* [Update repo ](#update-repo-)
	* [Update readme ](#update-readme-)
	* [Update doc ](#update-doc-)
	* [Publish](#publish)
	* [modifying submodules](#modifying-submodules)
* [Questions](#questions)


[](#installation)


[](#installation)

## Installation
Run the following command from the root of your project:

`ns plugin add @nativescript-community/ui-massifmaps`


[](#api)


[](#api)

## API

The API documentation for this plugin is available [here](https://nativescript-community.github.io/ui-massifmaps/).


[](#the-surface-api)


[](#the-surface-api)

## The surface API

There are two public surfaces. The **object API** — `MassifMap`, `VectorTileLayer`, `HTTPTileDataSource` — is what the rest of this README shows and is unchanged. The **surface API** is the SDK's id/handle + JSON facade, and is what new code should use: it is six verbs (`create`, `destroy`, `set`, `get`, `call`, `on`) over a table generated from the SDK itself, so a new SDK option costs no plugin code at all.

It is exported namespaced, because both surfaces spell a layer `MassifLayer` and a map `MassifMap`:

```ts
import { api } from '@nativescript-community/ui-massifmaps';
```

### Getting a map

```ts
// from the mapReady event - the map's Options must exist
const map = api.attach(mapView, { projection: 'EPSG:4326' });
```

The view's own event listener is **chained**, not replaced, so whatever the plugin (or your app) had installed keeps being called.

### Layers and sources are specs

```ts
api.createSource('osm', { type: 'http', minZoom: 0, maxZoom: 14, url: 'https://tiles/{z}/{x}/{y}.pbf' });

map.addLayer('base', {
    type: 'vector',
    opacity: 0.8,
    source: 'osm', // an id, or an inline spec of the kind that builds it
    style: { type: 'mbvt', project: { type: 'project', assets: { type: 'dir', path: '/sdcard/massif_style' }, name: 'osm' } }
});
```

A spec's keys are the constructor's parameters **plus every writable property of the class it builds**, so `opacity` (declared on `Layer`) works even though no layer constructor takes one. Creating an id that already exists with an identical spec returns the same object — that is how two maps share one source. A different spec under the same id is refused rather than silently replacing it.

### Properties

```ts
map.set('fogOptions.rangeStart', 2.5); // a dotted path walks object properties
map.set('fog.rangeStart', 2.5); // `fog` is an alias for `fogOptions` - same property
map.fog().set('rangeEnd', 4); // or scope onto one
map.terrain().apply({ exaggeration: 1.4, viewDistanceFactor: 2 }); // ONE crossing, not two

const speed: number = base.get('labelBlendingSpeed');
const at = e.getPos('clickPos', 'EPSG:4326'); // a coordinate, in the projection you want
```

A style's CartoCSS `param::` values, an HTTP header set and a layer's metadata are **bags**: the
rest of the path is a key of your own, and the property itself takes every key at once.

```ts
style.set('params.water_color', '#0af');
style.apply({ params: { water_color: '#0af', show_buildings: 'false' } });
source.set('HTTPHeaders.User-Agent', 'my-app/1.0');
```

`apply` is one native call whatever the key count, which is what makes it worth using over a loop
of `set`.

Values cross as the JavaScript type they should be: an enum is its **constant name**, a position is `[lon, lat]`, a struct is the JSON it encodes, a colour is an ARGB integer.

The handful of properties every app touches also have named, chainable accessors — one call reads, one writes:

```ts
base.visible(true).opacity(0.5).zoomRange([4, 18]).refresh();
if (!base.visible()) { … }
```

That list is **closed** (`opacity`, `visible`, `zoomRange`, plus `refresh`, `clearTileCaches`, `moveTo`, `detach`, `elevations`). A named accessor per property is a non-goal — there are 700 and the list grows with the SDK, which is what `set` / `apply` / `group` are for.

### The camera

A camera move is a flight with a duration, not a property, so it lives on its own object. Set the duration once and every move after it uses that:

```ts
map.camera().animate(400).zoom(14).tilt(45);

// position, zoom, rotation and tilt in ONE flight - four separate setters animate
// independently and visibly fight each other
map.camera().moveTo([5.7606, 45.2442], { zoom: 13.6, tilt: 25, duration: 800 });

map.camera().fitBounds([[5.7, 45.1], [5.8, 45.3]]);
const [lon, lat] = map.camera().position();
```

Positions are accepted either way round — `[lon, lat]` or the plugin's own `{ lat, lon }` — so the two surfaces mix freely.

### Events are Observable events

```ts
map.on('map.clicked', (e) => console.log(e.getPos('clickPos')));

base.on('vectortile.clicked', (e) => {
    console.log(e.get('featureLayerName'), e.get('featureId'), e.get('feature.properties.name'));
});
```

`on`, `once` and `off` are NativeScript's own. The native subscription is taken when the first handler for an event is added and dropped when the last one goes. Use `subscribe(event, handler, options)` when one handler needs a different projection from the object's default.

**Every handler runs on the main thread.** There is no delivery option, because in NativeScript there is no other answer: the SDK emits from its render and tile threads, and there is no JavaScript runtime on those — a callback there does not run late, it fails to run at all. The plugin's own native listener hops onto the main thread and *waits* before calling into JavaScript, which is also what lets `consumed` get back to the SDK in time and keeps the payload alive while the handler reads it.

For an event that fires above frame rate — `map.moved` is 47–159 a second during a drag — use `throttle`:

```ts
map.subscribe('map.moved', reposition, { throttle: 16 });
```

That is a plugin-side drop, not the facade's coalescing. Coalescing replaces a *pending* payload, and nothing is ever pending when the producer and the handler are the same thread. Never throttle a consumable event: a dropped click is one the SDK is still waiting on.

The payload is valid **only while the handler runs** — read what you need, do not keep the object.

Claim an event by setting `consumed`, the way a DOM handler calls `preventDefault`:

```ts
base.on('vectortile.clicked', (e) => {
    if (e.get('featureLayerName') === 'poi') {
        e.consumed = true; // nothing behind this handler sees the click
    }
});
```

`e.consumable` says whether that will do anything. Only a **consumable** event can be claimed — `vectortile.clicked`, `vectorelement.clicked` and `celestial.clicked`; `map.clicked` cannot, because `MapEventListener::onMapClicked` returns void and there is nothing to tell. Setting it anywhere else is accepted, ignored, and warned about once.

### Methods

```ts
const tile = source.call('loadTile', [8467, 5852, 14]);
const bytes = tile.getData('data'); // an ArrayBuffer, never a string
tile.destroy(); // an object result is yours

const metres = hillshade.call('getElevations', [[5.76, 45.24], [5.77, 45.25]]); // number[], one crossing

// on a worker; `extract` runs while the result is alive, because the facade frees it afterwards
const data = await source.callAsync('loadTile', [[8467, 5852, 14]], (t) => t.getData('data'));
```

A method can be addressed through a path: `base.call('tileDecoder.loadTile', [8467, 5852, 14])`. A style parameter is *not* one of them any more - it is a property, `base.set('style.params.buildings', 'false')`.

### Routing

Routing needs no plugin code — it is `create` plus `callAsync`, like everything else:

```ts
const router = map.object('routing', 'valhalla', {
    type: 'valhalla-online',
    profile: 'bicycle',
    customServiceURL: 'https://valhalla1.openstreetmap.de/{service}'
});

const request = map.object('routing', 'trip',
    { type: 'request', projection: 'EPSG:4326', points: [[5.72, 45.18], [5.74, 45.24]] },
    'massif::RoutingRequest');
request.set('params.language', 'fr-FR'); // a bag again - valhalla's parameters nest, so
request.set('params.costing_options.bicycle.cycling_speed', 22); // a dotted key stays one key

const trip = await router.callAsync('calculateRoute', [request.handle], (result) => ({
    metres: result.get('totalDistance'),
    // the path is the FLAT channel - a 9 km route is 562 positions
    path: result.call('getPoints'),
    steps: result.collect((step) => step.get('streetName'),
                          { countPath: 'instructionCount', method: 'getInstruction' })
}));
```

`profile`, `customServiceURL` and `timeout` are ordinary properties, so they complete and type-check. The **request** is one of the few things the SDK still builds with a hand-written factory, so it names its class — that is what the third argument is for, and it is required precisely so a misspelt key in a kind the schema *does* describe cannot slip through it.

**Geocoding is not reachable yet**, and that is an SDK gap rather than a plugin one: no geocoding class carries a `!spec` declaration or a registered method, and the module is absent from the generated schema entirely. Nothing here has to change once it lands — a spec kind and a method row are data.

### Moving over a piece at a time

```ts
const base = api.adoptLayer('base', existingLayer.getNative());
base.on('vectortile.clicked', …);
```

The concrete class is read off the native object, so an adopted `VectorTileLayer` answers to a vector tile layer's properties rather than only to `Layer`'s.

### Typings

`src/ui-massifmaps/api/massif-api.d.ts` and `schema.ts` are **generated** from the SDK's own `docs/api/massif-api.json` — the same schema its C++ property table is built from.

`massif-api.d.ts` is types only — a `.d.ts`, so it is never compiled and never reaches your bundle, whatever its size. The only runtime cost is `schema.ts` (~34 KB): each class' own properties, its base, the enum constants, and the method and event tables — the minimum a dotted path needs to be resolved the way the C++ resolves it. It is tree-shaken away entirely if you never import `api`.

Regenerate them after an SDK bump:

```sh
npm run typings.api        # reads $MASSIF_SDK_HOME/docs/api/massif-api.json
npm run typings.api.check  # typechecks the layer and its typing tests
```

That is what makes a wrong path, a misspelt spec key, an enum constant from the wrong enum, a method on the wrong class and an unknown event name all **compile errors**.

### Surface-only Android

The default Android AAR no longer ships the object API (`objectapi` is a separate variant). On it the map view runs on the surface API alone: `zoom`, `tilt`, `bearing`, `focusPos`, `flyTo`, `setZoom`, `moveToFitBounds`, `screenToMap`, `mapToScreen`, the map events and `map.api` (the map's surface `MassifMap`) work, and positions use the lon/lat of the view's keys. What still needs the object API fails with a message naming it: the legacy modules (`layers`, `datasources`, `vectorelements`, `components`...), `getOptions()` and its wrappers, `getPostProcessEffect`, `captureRendering`, `requestRedraw`, the `projection` property (the view is lon/lat) and `getLayers()`. The plugin's Java listeners are compiled only for an `objectapi` variant (`-PmassifSDKVariant=objectapi...`, or `-PmassifObjectApi`).

### Requirements and known gaps

- Needs an SDK built **with** `all/native/api` (`com.massifmaps.api.MassifApi` / `MSFMassifApi`). `api.isAvailable()` says whether it is there, and every call throws a clear error when it is not. On Android, `-PmassifApi=false` drops the plugin's own listener shim so the object API still builds against an older SDK.
- **`e.consumed` needs an SDK whose `MassifApi.on` takes the consume flag.** The rest of the chain is already there — the listener's return value is forwarded all the way to `Context::emit`, which only acts on it for a subscription that asked to consume, and `MassifApi::on` passes a literal `false`. `api.canConsume()` reports it, `e.consumable` reports it per event, and a handler that sets `consumed` anyway is warned once instead of silently doing nothing.
- An **object property cannot be read** (`get('fogOptions')`) — the facade has no `getObject`. Use `group('fogOptions')`, which is what you want anyway.
- A **collection** is read one element per crossing (`collect()`); a route's path and an elevation profile use the flat numeric channel instead.
- **Geocoding has no facade surface** — see [Routing](#routing). An SDK gap, not a plugin one.
- **An object property's value type is a bare `Handle`.** The brand is invariant, so branding it would reject the subclasses the SDK accepts (a `PolygonGeometry` where a `Geometry` is declared). The class is still known — `group()` stays fully typed — and the SDK downcasts and refuses a wrong class at runtime.


[](#the-example-gallery)


[](#the-example-gallery)

## The example gallery

The demo app opens on the same gallery the Android demo does — the SDK's own examples, grouped into the same sections, in the same order, with the same titles, descriptions and screenshots.

That is not a copy: `npm run examples` reads the SDK's `docs/examples/examples.json` — the manifest generated from each example's `@ExampleInfo` annotation, and the one the Android app and the website also build from — and writes `demo-snippets/svelte/examples/generated.ts`. A title can only be changed in one place, and the three galleries cannot drift.

```sh
npm run examples        # rebuild the metadata from the manifest
npm run examples.check  # typecheck every example's script against the plugin typings
```

Screenshots are **linked**, not bundled — `raw.githubusercontent.com/massif-maps/MassifMaps/master/docs/examples/screenshots/<id>.png`. That keeps 1.6 MB of PNG out of the package, needs no image rule in the host app's bundler, and means a recaptured screenshot shows up without a resync. The grid wants the network the first time it is opened. `--image-base <url>` points it elsewhere — a fork, a branch, or a local server.

The examples themselves are hand-written ports (the Java is Java, the Svelte is Svelte), written against the **surface API**. The generator pairs them by id — `display-a-map` ↔ `DisplayAMap.svelte` — and *reports* a manifest entry with no component rather than dropping it.

The menu offers a **grid** whenever the snippets carry that metadata: section headings, a card per example with its screenshot, title and description. The toolbar switches to the plain list; a snippet package that exports only `demos` gets the list and nothing changes for it.

`examples.check` is worth knowing about: a `<script lang="ts">` block is ordinary TypeScript, so each one is extracted and run through `tsc` against the real typings. A misspelt spec key or a property path that does not exist is a build failure rather than a warning on a device.


[](#usage-in-svelte)


[](#usage-in-svelte)

## Usage in Svelte

### Examples

- [Basic Raster](demo-snippets/svelte/BasicRaster.svelte)


[](#usage-in-vue)


[](#usage-in-vue)

## Usage in Vue

### Examples

- [Basic Raster](demo-snippets/vue/BasicRaster.vue)


[](#demos-and-development)


[](#demos-and-development)

## Demos and Development


### Repo Setup

The repo uses submodules. If you did not clone with ` --recursive` then you need to call
```
git submodule update --init
```

The package manager used to install and link dependencies must be `pnpm` or `yarn`. `npm` wont work.

To develop and test:
if you use `yarn` then run `yarn`
if you use `pnpm` then run `pnpm i`

**Interactive Menu:**

To start the interactive menu, run `npm start` (or `yarn start` or `pnpm start`). This will list all of the commonly used scripts.

### Build

```bash
npm run build.all
```
WARNING: it seems `yarn build.all` wont always work (not finding binaries in `node_modules/.bin`) which is why the doc explicitly uses `npm run`

### Demos

```bash
npm run demo.[ng|react|svelte|vue].[ios|android]

npm run demo.svelte.ios # Example
```

Demo setup is a bit special in the sense that if you want to modify/add demos you dont work directly in `demo-[ng|react|svelte|vue]`
Instead you work in `demo-snippets/[ng|react|svelte|vue]`
You can start from the `install.ts` of each flavor to see how to register new demos 


[](#contributing)


[](#contributing)

## Contributing

### Update repo 

You can update the repo files quite easily

First update the submodules

```bash
npm run update
```

Then commit the changes
Then update common files

```bash
npm run sync
```
Then you can run `yarn|pnpm`, commit changed files if any

### Update readme 
```bash
npm run readme
```

### Update doc 
```bash
npm run doc
```

### Publish

The publishing is completely handled by `lerna` (you can add `-- --bump major` to force a major release)
Simply run 
```shell
npm run publish
```

### modifying submodules

The repo uses https:// for submodules which means you won't be able to push directly into the submodules.
One easy solution is t modify `~/.gitconfig` and add
```
[url "ssh://git@github.com/"]
	pushInsteadOf = https://github.com/
```


[](#questions)


[](#questions)

## Questions

If you have any questions/issues/comments please feel free to create an issue or start a conversation in the [NativeScript Community Discord](https://nativescript.org/discord).

[](#demos-and-development)

## Demos and Development


### Repo Setup

The repo uses submodules. If you did not clone with ` --recursive` then you need to call
```
git submodule update --init
```

The package manager used to install and link dependencies must be `pnpm` or `yarn`. `npm` wont work.

To develop and test:
if you use `yarn` then run `yarn`
if you use `pnpm` then run `pnpm i`

**Interactive Menu:**

To start the interactive menu, run `npm start` (or `yarn start` or `pnpm start`). This will list all of the commonly used scripts.

### Build

```bash
npm run build.all
```
WARNING: it seems `yarn build.all` wont always work (not finding binaries in `node_modules/.bin`) which is why the doc explicitly uses `npm run`

### Demos

```bash
npm run demo.[ng|react|svelte|vue].[ios|android]

npm run demo.svelte.ios # Example
```

Demo setup is a bit special in the sense that if you want to modify/add demos you dont work directly in `demo-[ng|react|svelte|vue]`
Instead you work in `demo-snippets/[ng|react|svelte|vue]`
You can start from the `install.ts` of each flavor to see how to register new demos 


[](#contributing)

## Contributing

### Update repo 

You can update the repo files quite easily

First update the submodules

```bash
npm run update
```

Then commit the changes
Then update common files

```bash
npm run sync
```
Then you can run `yarn|pnpm`, commit changed files if any

### Update readme 
```bash
npm run readme
```

### Update doc 
```bash
npm run doc
```

### Publish

The publishing is completely handled by `lerna` (you can add `-- --bump major` to force a major release)
Simply run 
```shell
npm run publish
```

### modifying submodules

The repo uses https:// for submodules which means you won't be able to push directly into the submodules.
One easy solution is t modify `~/.gitconfig` and add
```
[url "ssh://git@github.com/"]
	pushInsteadOf = https://github.com/
```

[](#questions)

## Questions

If you have any questions/issues/comments please feel free to create an issue or start a conversation in the [NativeScript Community Discord](https://nativescript.org/discord).
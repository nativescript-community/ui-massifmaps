<script lang="ts">
    /**
     * Shaded relief computed on the fly from an elevation source and laid over the basemap: pick
     * the algorithm, scale the relief.
     */
    import ExampleShell from './ExampleShell.svelte';
    import type { ExampleHost } from './host';
    import { demTiles, massifStyle, vectorTiles } from './shared';

    const METHODS = ['IGOR', 'COMBINED', 'MULTIDIRECTIONAL', 'STANDARD', 'BASIC'];

    async function start(host: ExampleHost) {
        const map = host.map;

        map.addLayer('basemap', { type: 'vector', source: vectorTiles(), style: await massifStyle() });
        // heightScale 1 is the true slope, what MapLibre shades; the default is a twentieth of it.
        const hillshade = map.addLayer('hillshade', { type: 'hillshade', source: demTiles(), hillshadeMethod: METHODS[0], heightScale: 1 });
        map.camera().moveTo([5.83, 45.25], { zoom: 10.5 });

        let method = 0;
        host.button('Method', () => {
            method = (method + 1) % METHODS.length;
            hillshade.set('hillshadeMethod', METHODS[method]);
            host.caption(`${METHODS[method]} hillshade.`);
        });
        // A shader uniform: the relief changes without a tile being decoded again.
        host.slider('Exaggeration', 0, 3, 1, (value) => hillshade.set('exaggeration', value));
        host.caption('Chartreuse, Vercors and Belledonne, shaded from a terrarium DEM.');
    }
</script>

<ExampleShell id="hillshade" {start} title="Hillshade" />

<script lang="ts">
    /**
     * A legend resolved from the live style: switch the Massif variant and it follows, because none
     * of its colours is written down anywhere but in the style. The gallery host has no view slot,
     * so the legend is listed in the caption rather than drawn as swatches.
     */
    import ExampleShell from './ExampleShell.svelte';
    import type { ExampleHost } from './host';
    import { massifStyle, vectorTiles } from './shared';

    const VARIANTS = [
        ['streets', 'Streets'],
        ['outdoor', 'Outdoor'],
        ['topo', 'Topo'],
        ['eink', 'E-ink']
    ];

    interface Legend {
        sections: { label: string | Record<string, string>; items: { label: string | Record<string, string> }[] }[];
    }

    /** A label is a string or a {lang: text} object. */
    function text(label: string | Record<string, string>): string {
        return typeof label === 'object' && label ? (label.en ?? Object.values(label)[0]) : (label ?? '');
    }

    async function start(host: ExampleHost) {
        const map = host.map;

        const style = map.style('massif', await massifStyle('outdoor'));
        map.addLayer('basemap', { type: 'vector', source: vectorTiles(), style: 'massif' });
        map.camera().moveTo([5.7262, 45.2], { zoom: 13 });

        // getLegend reads the decoder's CURRENT parameters: call it again after any change.
        function showLegend(label: string) {
            const legend = style.call('getLegend', null) as unknown as Legend | null;
            const lines = (legend?.sections ?? []).map((section) => `${text(section.label)}: ${section.items.slice(0, 4).map((item) => text(item.label)).join(', ')}`);
            host.caption(`Massif ${label}\n${lines.join('\n')}`);
        }

        for (const [variant, label] of VARIANTS) {
            host.button(label, () => {
                style.set('params.variant', variant);
                showLegend(label);
            });
        }
        showLegend('Outdoor');
    }
</script>

<ExampleShell id="map-legend" {start} title="Map legend" />

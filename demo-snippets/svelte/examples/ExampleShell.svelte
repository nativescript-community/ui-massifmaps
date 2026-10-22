<script lang="ts">
    /**
     * Page + map + the controls an example declares. Deliberately thin: the point of the gallery
     * is that an example file contains the map code and nothing else.
     */
    import { api } from '@nativescript-community/ui-massifmaps';
    import { setShowError, setShowInfo, setShowWarn } from '@nativescript-community/ui-massifmaps/utils';
    import type { MassifMap } from '@nativescript-community/ui-massifmaps/api';
    import type { ExampleHost } from './host';
    import { goBack } from '@nativescript-community/svelte-native';
    import { onDestroy } from 'svelte';

    /** Shown in the action bar. */
    export let title: string;
    /** The registry id the map and everything it builds are scoped to. */
    export let id: string;
    /** Runs once the map is ready. This is the example. */
    export let start: (host: ExampleHost) => void | Promise<void>;

    interface Control {
        label: string;
        toggle: boolean;
        slider?: boolean;
        min?: number;
        max?: number;
        value?: number;
        on: boolean;
        action: (on: any) => void;
    }

    let map: MassifMap;
    let caption = '';
    let controls: Control[] = [];
    // Split by kind so each gets its own row, keeping the original index for the callbacks.
    let sliders: (Control & { index: number; slot: number })[] = [];
    let buttons: (Control & { index: number })[] = [];
    $: sliders = controls
        .map((control, index) => ({ ...control, index }))
        .filter((control) => control.slider)
        .map((control, slot) => ({ ...control, slot }));
    $: buttons = controls.map((control, index) => ({ ...control, index })).filter((c) => !c.slider);
    let error = '';
    const timers: any[] = [];

    async function onMapReady(event) {
        console.log(`[massif-ex] ${id}: mapReady, api available ${api.isAvailable()}`);
        if (!api.isAvailable()) {
            error = 'This build of the SDK has no surface API - see the plugin README.';
            return;
        }
        setShowError(true);
        setShowWarn(true);
        setShowInfo(true);
        try {
            // EPSG:4326 once, so every position in the example - and every one read back out of
            // an event - is plain lon/lat rather than the map's own metres.
            map = api.attach(event.object, { id, projection: 'EPSG:4326' });
            console.log(`[massif-ex] ${id}: attached`);
            map.subscribe('map.idle', () => console.log(`[massif-ex] ${id}: map.idle`));
            map.subscribe('map.stable', (e) => console.log(`[massif-ex] ${id}: map.stable ${e.reason}`));
            const started = Date.now();
            await start(host());
            console.log(`[massif-ex] ${id}: start done in ${Date.now() - started} ms`);
        } catch (e: any) {
            error = String(e?.message ?? e);
            console.error(`[massif-ex] ${id}: start failed: ${error}`, e?.stack);
        }
    }

    function host(): ExampleHost {
        return {
            map,
            caption: (text: string) => (caption = text ?? ''),
            button: (label, action) => (controls = [...controls, { label, toggle: false, on: false, action }]),
            toggle: (label, on, action) => (controls = [...controls, { label, toggle: true, on, action }]),
            slider: (label, min, max, value, action) =>
                (controls = [
                    ...controls,
                    { label, toggle: false, slider: true, min, max, value, on: false, action }
                ]),
            setSlider: (label, value) => {
                const control = controls.find((c) => c.slider && c.label === label);
                if (control) {
                    control.value = value;
                    controls = controls;
                }
            },
            after: (millis, action) => timers.push(setTimeout(action, millis))
        };
    }

    function slide(index: number, value: number) {
        const control = controls[index];
        control.value = value;
        controls = controls;
        try {
            control.action(value);
        } catch (e) {
            caption = String(e?.message ?? e);
            console.error(caption);
        }
    }

    function tap(index: number) {
        const control = controls[index];
        if (control.toggle) {
            control.on = !control.on;
            controls = controls;
        }
        try {
            control.action(control.on);
        } catch (e) {
            caption = String(e?.message ?? e);
            console.error(caption);
        }
    }

    onDestroy(() => {
        for (const timer of timers) {
            clearTimeout(timer);
        }
        // Releases the map's registration and every id the example built under it.
        map?.destroy();
    });
</script>

<page>
    <actionBar {title}>
        <navigationButton text="Back" android.systemIcon="ic_menu_back" on:tap={() => goBack()} />
    </actionBar>

    <gridLayout rows="*, auto, auto, auto">
        <massifmap row="0" rowSpan="4" on:mapReady={onMapReady} />

        <!-- Sliders get their own row, above the buttons: they need the full width for the thumb to
             have a travel a finger can aim at, and they must not share a scrolling container. -->
        {#if sliders.length}
            <gridLayout class="example-sliders" row="1" columns={sliders.map(() => '*').join(', ')}>
                {#each sliders as control (control.index)}
                    <stackLayout class="example-slider" col={control.slot}>
                        <label class="example-slider-label" text="{control.label}  {control.value.toFixed(2)}" />
                        <slider minValue={control.min} maxValue={control.max} value={control.value} on:valueChange={(e) => slide(control.index, e.value)} />
                    </stackLayout>
                {/each}
            </gridLayout>
        {/if}

        {#if buttons.length}
            <wrapLayout class="example-controls" row="2">
                {#each buttons as control (control.index)}
                    <button class="example-control {control.toggle ? (control.on ? 'is-on' : 'is-off') : ''}" text={control.label} on:tap={() => tap(control.index)} />
                {/each}
            </wrapLayout>
        {/if}

        {#if error || caption}
            <label class="example-caption" row="3" text={error || caption} textWrap="true" />
        {/if}
    </gridLayout>
</page>

<style>
    .example-controls {
        padding: 8 8 0 8;
    }
    .example-control {
        margin: 4;
        padding: 6 14;
        font-size: 13;
        border-radius: 18;
        background-color: #ffffffee;
        color: #1d1b18;
        android-elevation: 2;
    }
    .example-control.is-on {
        background-color: #e5484d;
        color: #ffffff;
    }
    .example-control.is-off {
        background-color: #ffffffcc;
        color: #77716a;
    }
    .example-sliders {
        padding: 8 8 0 8;
    }
    .example-slider {
        margin: 4;
        padding: 2 10;
        border-radius: 12;
        background-color: #ffffffee;
        android-elevation: 2;
    }
    .example-slider-label {
        font-size: 11;
        color: #1d1b18;
    }
    .example-caption {
        padding: 10 14;
        font-size: 13;
        color: #ffffff;
        background-color: #1d1b18cc;
    }
</style>

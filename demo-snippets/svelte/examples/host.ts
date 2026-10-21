import type { MassifMap } from '@nativescript-community/ui-massifmaps/api';

/**
 * The screen an example runs on - the NativeScript twin of the Android app's `ExampleHost`.
 *
 * Everything view-shaped lives behind this so an example file reads as map code: a control is one
 * call, not a component plus a binding plus a layout. The controls appear in a row at the bottom
 * of the screen, above the caption.
 *
 * A plain `.ts` rather than a `context="module"` block in the shell, so `npm run examples.check`
 * can typecheck every example's script against it without a Svelte compiler.
 */
export interface ExampleHost {
    /**
     * The map, already attached and ready. Registered under the example's own id, so two examples
     * cannot collide, and released - with every layer it built - when the screen goes away.
     */
    map: MassifMap;
    /** A line of text along the bottom telling the user what to do. Empty hides it. */
    caption(text: string): void;
    /** A push button in the control row. */
    button(label: string, action: () => void): void;
    /** An on/off button in the control row, starting in the given state. */
    toggle(label: string, on: boolean, action: (on: boolean) => void): void;
    /**
     * A slider in the control row, for a value worth sweeping rather than picking - a duration, an
     * exaggeration. The label is shown with the current value appended.
     */
    slider(label: string, min: number, max: number, value: number, action: (value: number) => void): void;
    /**
     * Moves the slider with that label, for a value that changes by itself: a clock. Does not call
     * the slider's action, which is for the hand.
     */
    setSlider(label: string, value: number): void;
    /** Runs something after a delay, cancelled when the example stops. */
    after(millis: number, action: () => void): void;
}

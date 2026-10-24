// GENERATED FILE - do not edit by hand.
// Regenerate with `npm run bindings`.

import { Color } from '@nativescript/core';

/** com.massifmaps.components.FogOptions / MSFFogOptions */
export const METHODS = ['getColor', 'getHighColor', 'getHorizonBlend', 'getRangeEnd', 'getRangeStart', 'getShaderSource', 'getSpaceColor', 'getStarIntensity', 'isEnabled', 'setColor', 'setEnabled', 'setHighColor', 'setHorizonBlend', 'setRangeEnd', 'setRangeStart', 'setShaderSource', 'setSpaceColor', 'setStarIntensity'] as const;

/** the forwarders METHODS installs, so they are visible to TypeScript */
export interface Methods {
    getColor(): Color;
    getHighColor(): Color;
    getHorizonBlend(): number;
    getRangeEnd(): number;
    getRangeStart(): number;
    getShaderSource(): string;
    getSpaceColor(): Color;
    getStarIntensity(): number;
    isEnabled(): boolean;
    setColor(arg0: Color | string): void;
    setEnabled(arg0: boolean): void;
    setHighColor(arg0: Color | string): void;
    setHorizonBlend(arg0: number): void;
    setRangeEnd(arg0: number): void;
    setRangeStart(arg0: number): void;
    setShaderSource(arg0: string): void;
    setSpaceColor(arg0: Color | string): void;
    setStarIntensity(arg0: number): void;
}

export const ACCESSORS: Record<string, [string, string]> = {
    color: ['getColor', 'setColor'],
    enabled: ['isEnabled', 'setEnabled'],
    highColor: ['getHighColor', 'setHighColor'],
    horizonBlend: ['getHorizonBlend', 'setHorizonBlend'],
    rangeEnd: ['getRangeEnd', 'setRangeEnd'],
    rangeStart: ['getRangeStart', 'setRangeStart'],
    shaderSource: ['getShaderSource', 'setShaderSource'],
    spaceColor: ['getSpaceColor', 'setSpaceColor'],
    starIntensity: ['getStarIntensity', 'setStarIntensity'],
};

/** public shape of the accessors this class declares itself */
export interface Accessors {
    color: Color | string;
    enabled: boolean;
    highColor: Color | string;
    horizonBlend: number;
    rangeEnd: number;
    rangeStart: number;
    shaderSource: string;
    spaceColor: Color | string;
    starIntensity: number;
}

/** properties needing a converter, and which one */
export const CONVERTERS = [['color', 'colorConverter'], ['highColor', 'colorConverter'], ['spaceColor', 'colorConverter']] as const;

export const SELECTORS: Record<string, string> = {};

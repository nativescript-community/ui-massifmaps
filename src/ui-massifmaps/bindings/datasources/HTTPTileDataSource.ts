// GENERATED FILE - do not edit by hand.
// Regenerate with `npm run bindings`.

/** com.massifmaps.datasources.HTTPTileDataSource / MSFHTTPTileDataSource */
export const METHODS = ['buildTagValues', 'buildTileURL', 'getBaseURL', 'getHTTPHeaders', 'getSubdomains', 'getTimeout', 'isMaxAgeHeaderCheck', 'isTMSScheme', 'loadTile', 'setBaseURL', 'setHTTPHeaders', 'setMaxAgeHeaderCheck', 'setSubdomains', 'setTMSScheme', 'setTimeout'] as const;

/** the forwarders METHODS installs, so they are visible to TypeScript */
export interface Methods {
    buildTagValues(arg0: any): any;
    buildTileURL(arg0: string, arg1: any): string;
    getBaseURL(): string;
    getHTTPHeaders(): any;
    getSubdomains(): string[];
    getTimeout(): number;
    isMaxAgeHeaderCheck(): boolean;
    isTMSScheme(): boolean;
    loadTile(arg0: any): any;
    setBaseURL(arg0: string): void;
    setHTTPHeaders(arg0: any): void;
    setMaxAgeHeaderCheck(arg0: boolean): void;
    setSubdomains(arg0: string[]): void;
    setTMSScheme(arg0: boolean): void;
    setTimeout(arg0: number): void;
}

export const ACCESSORS: Record<string, [string, string]> = {
    baseURL: ['getBaseURL', 'setBaseURL'],
    httpHeaders: ['getHTTPHeaders', 'setHTTPHeaders'],
    maxAgeHeaderCheck: ['isMaxAgeHeaderCheck', 'setMaxAgeHeaderCheck'],
    subdomains: ['getSubdomains', 'setSubdomains'],
    timeout: ['getTimeout', 'setTimeout'],
    tmsScheme: ['isTMSScheme', 'setTMSScheme'],
};

/** public shape of the accessors this class declares itself */
export interface Accessors {
    baseURL: string;
    httpHeaders: any;  // com.massifmaps.core.StringMap
    maxAgeHeaderCheck: boolean;
    subdomains: string[];
    timeout: number;
    tmsScheme: boolean;
}

/** properties needing a converter, and which one */
export const CONVERTERS = [['subdomains', 'stringListConverter']] as const;

/** ObjC concatenates selector parts, so these names differ on iOS */
export const SELECTORS: Record<string, string> = {
    buildTileURL: 'buildTileURLTile',
};

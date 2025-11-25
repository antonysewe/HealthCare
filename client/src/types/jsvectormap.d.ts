declare module 'jsvectormap' {
  // Types tailored to how jsVectorMap is used in this codebase.
  export type JsVectorMapStyle = Record<string, string | number | boolean>;

  export interface RegionStyle {
    initial?: JsVectorMapStyle;
    hover?: JsVectorMapStyle;
    selected?: JsVectorMapStyle;
  }

  export interface LabelsRegionsOptions {
    render?: (code: string, element?: HTMLElement) => string | void;
  }

  export interface LabelsOptions {
    regions?: LabelsRegionsOptions;
    // other label types (markers, etc.) omitted for brevity
    [key: string]: any;
  }

  export interface JsVectorMapOptions {
    selector?: string | HTMLElement;
    map?: string | Record<string, any>;
    zoomButtons?: boolean;
    series?: Record<string, any>;
    regionStyle?: RegionStyle;
    regionLabelStyle?: RegionStyle;
    labels?: LabelsOptions;
    // allow other library-specific options
    [key: string]: any;
  }

  export default class jsVectorMap {
    constructor(options: JsVectorMapOptions);
    destroy(): void;
    setValues(values: Record<string, number>): void;
    setOption(name: string, value: any): void;
    updateSize(): void;
    on(eventName: string, handler: (...args: any[]) => void): void;
    off(eventName: string, handler?: (...args: any[]) => void): void;

    // The library exposes a static addMap function used by the shipped map files
    static addMap(name: string, mapData: any): void;

    [key: string]: any;
  }

  // Also export the ESM path if some imports target the dist file directly
  declare module 'jsvectormap/dist/jsvectormap.esm.js' {
    const jsVectorMapEsm: typeof jsVectorMap;
    export default jsVectorMapEsm;
  }
}

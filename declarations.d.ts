declare module 'html-to-image' {
  export interface Options {
    filter?: (domNode: HTMLElement) => boolean;
    backgroundColor?: string;
    width?: number;
    height?: number;
    style?: Partial<CSSStyleDeclaration>;
    quality?: number;
    cacheBust?: boolean;
    imagePlaceholder?: string;
    pixelRatio?: number;
    contentType?: string;
    skipAutoScale?: boolean;
    [key: string]: any;
  }
  export function toPng(node: HTMLElement, options?: Options): Promise<string>;
  export function toJpeg(node: HTMLElement, options?: Options): Promise<string>;
  export function toBlob(node: HTMLElement, options?: Options): Promise<Blob | null>;
  export function toPixelData(node: HTMLElement, options?: Options): Promise<Uint8ClampedArray>;
  export function toSvg(node: HTMLElement, options?: Options): Promise<string>;
}

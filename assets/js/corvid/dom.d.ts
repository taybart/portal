import { logger } from './utils';
/****************
 *     DOM      *
 ***************/
/*** window ***/
/**
 * onDomContentLoaded callback
 */
export declare function ready(cb: () => void): void;
export declare function on(event: string, cb: (ev: Event) => void): () => void;
export declare function onKey(key: string, cb: (ev: {
    ctrl: boolean;
    alt: boolean;
    meta: boolean;
    shift: boolean;
}) => void, verbose?: boolean): () => void;
export declare function els(query: string, verbose?: boolean): el[];
/*** element ***/
type elOpts = {
    element?: HTMLElement;
    query?: string;
    type?: string;
    content?: any;
    class?: string | string[];
    style?: Object;
    id?: string;
    parent?: HTMLElement | el;
};
export declare class el {
    el: HTMLElement | null;
    query: string;
    log: logger;
    listeners: Record<string, Array<(ev: Event) => void>>;
    constructor(opts: HTMLElement | string | elOpts, verbose?: boolean);
    static query(query: string, verbose?: boolean): el;
    /*** dom manipulation ***/
    value(update?: string): string | el;
    parent(parent: HTMLElement | el): this;
    appendChild(ch: HTMLElement | el): this;
    child(ch: HTMLElement | el): this;
    prependChild(ch: HTMLElement | el): this;
    empty(): this;
    content(content: any, { text }?: {
        text?: boolean;
    }): this;
    src(url: string): this;
    /*** Style ***/
    style(update: Object | string, stringify?: boolean): this | undefined;
    hasClass(className: string): boolean;
    addClass(className: string | string[]): this;
    removeClass(className: string | string[]): this;
    /*** Templates ***/
    html(content: string): void;
    render(vars?: {}): string;
    appendTemplate(template: el, vars: any): void;
    /*** Events ***/
    on(event: string, cb: (ev: Event) => void): this;
    listen(event: string, cb: (ev: Event) => void): this;
    removeListeners(event: string): this;
}
/**
 * Get a template from a string
 * https://stackoverflow.com/a/41015840
 * @param  str    The string to interpolate
 * @param  params The parameters
 * @return The interpolated string
 */
export declare function interpolate(str: string, params: Object): string;
declare const _default: {
    el: typeof el;
    els: typeof els;
    ready: typeof ready;
    on: typeof on;
    onKey: typeof onKey;
};
export default _default;

import { logger } from './utils';
/*** url params ***/
export declare class params {
    params: URLSearchParams;
    constructor(p?: Object);
    set(p: Object): this;
    toString(): string;
    static render(p: Object): string;
}
/*** http request ***/
export type requestOpts = {
    url?: string;
    type?: 'json';
    method?: 'HEAD' | 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';
    params?: Object | params;
    headers?: Record<string, string>;
    auth?: string | {
        username: string;
        password: string;
    };
    body?: Object;
    expect?: number;
    credentials?: RequestCredentials;
    insecureNoVerify?: boolean;
    fetch?: (url: string, init: RequestInit) => Promise<any>;
};
export declare class request {
    opts: requestOpts;
    log: logger;
    constructor(opts?: requestOpts, verbose?: boolean);
    auth(token: string | {
        username: string;
        password: string;
    }): this;
    basicAuth(username: string, password: string): this;
    body(body: Object): this;
    build({ path, params: passedParams, override, }?: {
        path?: string;
        params?: Object;
        override?: {
            success?: number;
            params?: Object;
            body?: Object;
            headers?: Object;
            method?: string;
        };
    }): {
        url: string;
        options: {
            method: string | undefined;
            credentials: RequestCredentials | undefined;
            headers: {
                constructor: Function;
                toString(): string;
                toLocaleString(): string;
                valueOf(): Object;
                hasOwnProperty(v: PropertyKey): boolean;
                isPrototypeOf(v: Object): boolean;
                propertyIsEnumerable(v: PropertyKey): boolean;
            };
            body: string;
        };
    };
    do({ path, params: passedParams, override, }?: {
        path?: string;
        params?: Object;
        method?: string;
        override?: {
            method?: string;
            params?: Object;
            headers?: Object;
            body?: Object;
            expect?: number;
        };
    }): Promise<any>;
}
/*** websocket ***/
export declare class ws {
    url: string;
    ws: WebSocket | null;
    backoff: number;
    max_timeout: number;
    should_reconnect: boolean;
    is_connected: boolean;
    recursion_level: number;
    reconnect_timer: number | null;
    log: logger;
    event_listeners: Record<string, Array<(data: any) => void>>;
    constructor(url: string, verbose?: boolean);
    setup(): void;
    send(data: any): void;
    onMessage(cb: (data: any) => void): void;
    onJSON(cb: (data: any) => void): void;
    on(event: string, cb: (data: any) => void): void;
    close(): void;
}
/*** refresh ***/
export declare class refresh {
    url: string;
    should_reload: boolean;
    constructor(url: string);
    listen(): void;
}
/*** server sent events ***/
declare const _default: {
    params: typeof params;
    request: typeof request;
    ws: typeof ws;
    refresh: typeof refresh;
};
export default _default;

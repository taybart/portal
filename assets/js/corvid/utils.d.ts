/***************
 *    Utils    *
 **************/
/**
 * Generates a random id of length len using provided alphabet
 * @param len - The length of the string to generate
 * @param [alphabet='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'] - The set of characters to use
 * @return A new random id
 */
export declare function genID(len?: number, alphabet?: string): string;
/**
 * Clipboard helper because i can't remember the funciton names
 */
export declare const clipboard: {
    check(): void;
    copy(text: string): Promise<void>;
    copyArbitrary(data: any): Promise<void>;
    read(): Promise<string>;
    readArbitrary(): Promise<any>;
    listen(query: string | HTMLElement, cb: (contents: string) => string): void;
};
export declare enum logLevel {
    none = -1,
    error = 0,
    warn = 1,
    info = 2,
    debug = 3,
    trace = 4
}
export declare class logger {
    level: logLevel;
    prefix: string;
    constructor(level?: logLevel, prefix?: string);
    error(...args: any[]): void;
    warn(...args: any[]): void;
    info(...args: any[]): void;
    debug(...args: any[]): void;
    trace(...args: any[]): void;
    log(...args: any[]): void;
}

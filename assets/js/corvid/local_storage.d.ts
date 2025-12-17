import { el } from './dom';
export declare function get(key: string, _default?: any): any;
export declare function update(key: string, update: (current: any) => any, broadcast?: boolean): void;
export declare function set(key: string, value: any, broadcast?: boolean): void;
export declare function setObj(update: object, prefix?: string, broadcast?: boolean): void;
export declare function listen(key: string, cb: (update: {
    key: string;
    value: any;
}) => void | el): void;
export declare function clear(key: string): void;

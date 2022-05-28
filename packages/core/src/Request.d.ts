import { Locale } from "./localization";
import { Cloneable } from "./utility";
export default abstract class Request implements Cloneable {
    abstract getType(): RequestType;
    abstract getMime(): string;
    abstract getPath(): string;
    abstract getLocale(): Locale;
    abstract getReferer(): string;
    abstract getBlockPath(): string;
    abstract clone(): this;
}
export declare class DummyRequest extends Request {
    path: string;
    constructor(path: string);
    getType(): RequestType;
    getMime(): string;
    getPath(): string;
    getLocale(): Locale;
    getReferer(): string;
    getBlockPath(): string;
    clone(): this;
}
export declare const enum RequestType {
    /** Full view */
    FULL = 0,
    /** Get the partial update for the view */
    PARTIAL = 1,
    ACTION = 2,
    /** View requests only a block */
    BLOCK = 3
}

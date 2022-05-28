import { Locale, Request, RequestType } from "@fortles/core";
export default class TestRequest extends Request {
    path: string;
    type: RequestType;
    mime: string;
    referer: string;
    blockPath: string;
    constructor(path?: string, type?: RequestType, mime?: string);
    getType(): RequestType;
    getMime(): string;
    getPath(): string;
    getLocale(): Locale;
    getReferer(): string;
    getBlockPath(): string;
    clone(): this;
}

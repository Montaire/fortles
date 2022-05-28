/// <reference types="node" />
import * as http from "http";
import { Request, RequestType, Locale } from "@fortles/core";
export default class ServerRequest extends Request {
    protected httpRequest: http.IncomingMessage;
    constructor(request: http.IncomingMessage);
    getType(): RequestType;
    getMime(): string;
    getPath(): string;
    getLocale(): Locale | null;
    getClosestLocale(): Locale | null;
    getReferer(): string;
    getBlockPath(): string;
    getOriginal(): http.IncomingMessage;
    clone(): this;
}

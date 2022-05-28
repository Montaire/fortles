/// <reference types="node" />
/// <reference types="node" />
import * as http from "http";
import * as stream from "stream";
import { Response, Controller } from "@fortles/core";
export default class ServerResponse extends Response {
    httpResponse: http.ServerResponse;
    /**
     * @param {http.ServerResponse} response
     */
    constructor(controller: Controller, response: http.ServerResponse);
    write(content: any): void;
    close(): void;
    getStream(): stream.Writable;
    getOriginal(): http.ServerResponse;
    setMime(mime: string): void;
}

import { Controller, Response } from "@fortles/core";
export default class TestResponse extends Response {
    body: string;
    target: string;
    blockPath: string;
    constructor(controller?: Controller);
    write(content: any): void;
    close(): void;
    toString(): string;
    getBody(): string;
    setBlockPath(path: string): void;
}

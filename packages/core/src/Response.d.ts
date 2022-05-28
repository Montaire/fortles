/// <reference types="node" />
import { Controller } from "./index.js";
import * as stream from "stream";
import { Locale } from "./localization/index.js";
/**
 * Response
 */
export default abstract class Response {
    protected controller: Controller;
    protected template: string;
    protected data: {};
    /**
     * Creates a new response for the given controller
     * @param controller
     */
    constructor(controller: Controller);
    /**
     * Write contents to the output buffer.
     * Buffering strategy is up to the @see Platform.
     * @param content Content to write.
     */
    abstract write(content: any): void;
    /**
     * Closes the ouput stream.
     * Application will call this automatically.
     */
    abstract close(): void;
    /**
     * Gets the name of the template
     * @returns
     */
    getTemplateName(): string;
    /**
     * Sets the name of the template
     * @param template
     */
    setTemplateName(template: string): void;
    getData(): Object;
    getController(): Controller;
    getLocale(): Locale;
    getStream(): stream.Writable;
    setMime(mime: string): void;
    setBlockPath(path: string): void;
    setData(data: object): void;
}

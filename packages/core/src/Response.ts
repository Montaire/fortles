import { Controller } from "./index.js";
import * as stream from "stream";
import { Locale } from "./localization/index.js"

/**
 * Response
 */
export default abstract class Response{
    protected controller: Controller;
    protected template: string|null = 'Main';
    protected data = {};

    /**
     * Creates a new response for the given controller
     * @param controller
     */
    constructor(controller: Controller){
        this.controller = controller;
    }

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
    getTemplateName(): string|null{
        return this.template;
    }

    /**
     * Sets the name of the template
     * @param template 
     */
    setTemplateName(template: string|null): void{
        this.template = template;
    }

    getData(): {[key: string]: any}{
        return this.data;
    }

    getController(): Controller{
        return this.controller;
    }

    getLocale(): Locale | null{
        return null;
    }

    getStream(): stream.Writable | null{
        return null;
    }

    setMime(mime: string): void{

    }

    setBlockPath(path: string | null){
        
    }

    setData(data: object){
        this.data = data;
    }
}
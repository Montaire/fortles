import { Controller } from "../index.js";
import { Locale } from "./localization/index.js"

/**
 * Response
 */
export default abstract class Response{
    protected controller: Controller;
    protected template = 'Main';
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
    abstract write(content: string): void;

    /**
     * Closes the ouput stream.
     * Application will call this automatically.
     */
    abstract close(): void;

    /**
     * Gets the name of the template
     * @returns
     */
    getTemplateName(): string{
        return this.template;
    }

    /**
     * Sets the name of the template
     * @param template 
     */
    setTemplateName(template: string): void{
        this.template = template;
    }

    getData(): Object{
        return this.data;
    }

    getController(): Controller{
        return this.controller;
    }

    getLocale(): Locale{
        return null;
    }
}
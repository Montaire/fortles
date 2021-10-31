import { Controller } from "essentials";
import { Writable } from "readable-stream";

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

    abstract write(content: string): void;

    abstract close(): void;

    /**
     * Gets the name of the template
     * @returns {string}
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
}
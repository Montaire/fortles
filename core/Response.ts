import { Writable } from "readable-stream";

/**
 * Response
 * @extends Writable
 */
export default class Response extends Writable{
    #controller;
    #template = 'Main';
    #data = {};

    /**
     * Creates a new response for the given controller
     * @param {import("./Controller.js")} controller
     */
    constructor(controller){
        super();
        this.#controller = controller;
    }

    /**
     * Gets the name of the template
     * @returns {string}
     */
    getTemplateName(){
        return this.#template;
    }

    /**
     * Sets the name of the template
     * @param {string} template 
     */
    setTemplateName(template){
        this.#template = template;
    }

    /**
     * Gets the stored data
     * @returns {Object}
     */
    getData(){
        return this.#data;
    }

    /**
     * @returns {import("./Controller.js").default}
     */
    getController(){
        return this.#controller;
    }
}
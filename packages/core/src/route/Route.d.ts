import { Type } from "@fortles/model";
import { Controller, Request, Block } from "../index.js";
/**
 * Route defines the structure, and the navigation in the application.
 */
export default class Route {
    protected path: string;
    protected routeBlocks: Map<string, Block>;
    protected parameters: Map<string, Type<any, any>>;
    protected templateName: string;
    protected name: string;
    protected controller: Controller;
    constructor(name: string, template: string, controller: Controller);
    /**
     * Adds a Block with an attached Controller with default template.
     * Use this to inject dependency trough the contructor of the Controller.
     * @param block Name of the targeted block in the view.
     * @param controller The attached controller to the block.
     * @param template Template of the block. Can be null for self.
     * @return Self for chaining functions.
     */
    addController(block: string, controller: Controller, template?: string): this;
    /**
     * Adds a Block to the current Controller.
     * Use this to inject dependency trough the contructor of the Controller.
     * @param block Name of the targeted block in the view.
     * @param template Template of the block. Can be null for self.
     * @return Self for chaining functions.
     */
    addTemplate(block: string, template: string): this;
    /**
     * Adds a parameter to the route
     * @param name Name of the parameter
     * @param type type of the parameter. This field is not required, if the entity has this parameter.
     * @returns self
     */
    addParameter(name: string, type?: Type<any, any>): this;
    /**
     * Returns the owner and the template name for the required view name
     *
     * @param name Name of the targeted block in the view
     * @return Controller and the requred template
     */
    getBlock(name: string): Block;
    getBlocks(): Map<string, Block>;
    hasBlock(name: string): boolean;
    /**
     * Mathches the route against the particular request.
     *
     * @param request The request to match against.
     * @return True on match.
     */
    match(request: Request): boolean;
    getTemplate(): string;
    getName(): string;
}

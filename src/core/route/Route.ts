import { Type } from "@fortles/model";
import { ModelAwareController } from "../Controller.js";
import { RuntimeError } from "../Error.js";
import { Controller, Request } from "../index.js"
//import { Type } from "../type/index.js";

/**
 * Route defines the structure, and the navigation in the application.
 */
export default class Route {

    protected path: string;
    protected routeBlocks = new Map<string, RouteBlock>();
    protected parameters = new Map<string, Type<any, any>>()
    protected template: string;
    protected name: string;
    protected controller: Controller;

    constructor(name: string, template: string, controller: Controller) {
        this.name = name;
        this.path = '/' + (name || '');
        this.template = template;
        this.controller = controller;
    }

    /**
     * Adds a Block with an attached Controller with default template.
     * Use this to inject dependency trough the contructor of the Controller.
     * @param block Name of the targeted block in the view.
     * @param controllerClass Controller definition attached to the block. Can be empty
     * @param template Template of the block. Can be null for self.
     * @return Self for chaining functions.
     */
    public add(block: string, controllerClass: typeof Controller = null, template: string = null): this {
        if(controllerClass){
            var controller = new controllerClass();
            controller.setEUri(this.controller.getEUri() == null ? block : this.controller.getEUri() + "-" + block);
        }
        this.routeBlocks.set(block, new RouteBlock(controller, template || this.template));
        return this;
    }

    public addController(block: string, controllerClass: typeof Controller): this{
        return this.add(block, controllerClass, null);
    }

    public addTemplate(block: string, template: string):this{
        return this.add(block, null, template);
    }

    /**
     * Adds a parameter to the route
     * @param name Name of the parameter
     * @param type type of the parameter. This field is not required, if the entity has this parameter.
     * @returns self
     */
    public addParameter(name: string, type: Type<any, any> = null){
        if(type == null && this.controller instanceof ModelAwareController && this.controller.getModel().hasType(name)){
            type = this.controller.getModel().getType(name);
        }
        if(type == null){
            throw new RuntimeError("Type can be only null, if connected entity has a property with the same name");
        }
        this.parameters.set(name, type);
        return this;
    }

    /**
     * Returns the owner and the template name for the required view name
     *
     * @param name Name of the targeted block in the view
     * @return Controller and the requred template
     */
    getBlock(name: string): RouteBlock {
        return this.routeBlocks.get(name);
    }

    /**
     * Mathches the route against the particular request.
     *
     * @param request The request to match against.
     * @return True on match.
     */
    match(request: Request): boolean {
        if (this.path == request.getPath()) {
            return true;
        }
        return false;
    }
    
    public getTemplate(): string {
        return this.template;
    }

    public getName(): string {
        return this.name;
    }

}

/**
     * A Block is an interchangeble element on the view.
     */
 export class RouteBlock{

    private template: string;
    private controller: Controller;
    /**
     * Creates a new block.
     * @param {Controller} Controller for the block
     * @param {string} Template to render the data.
     */
    constructor(controller: Controller,  template: string) {
        this.controller = controller;
        this.template = template;
    }

    getTemplate(): string{
        return this.template;
    }

    getController(): Controller{
        return this.controller;
    }
}
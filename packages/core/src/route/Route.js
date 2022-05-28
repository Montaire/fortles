import { RuntimeError, ModelAwareController, Block } from "../index.js";
//import { Type } from "../type/index.js";
/**
 * Route defines the structure, and the navigation in the application.
 */
export default class Route {
    path;
    routeBlocks = new Map();
    parameters = new Map();
    templateName;
    name;
    controller;
    constructor(name, template, controller) {
        this.name = name;
        this.path = '/' + (name || '');
        this.templateName = template;
        this.controller = controller;
    }
    /**
     * Adds a Block with an attached Controller with default template.
     * Use this to inject dependency trough the contructor of the Controller.
     * @param block Name of the targeted block in the view.
     * @param controller The attached controller to the block.
     * @param template Template of the block. Can be null for self.
     * @return Self for chaining functions.
     */
    addController(block, controller, template = null) {
        controller.setBlockPath(this.controller.getBlockPath(block));
        this.routeBlocks.set(block, new Block(controller, template || this.templateName));
        return this;
    }
    /**
     * Adds a Block to the current Controller.
     * Use this to inject dependency trough the contructor of the Controller.
     * @param block Name of the targeted block in the view.
     * @param template Template of the block. Can be null for self.
     * @return Self for chaining functions.
     */
    addTemplate(block, template) {
        this.routeBlocks.set(block, new Block(null, template || this.templateName));
        return this;
    }
    /**
     * Adds a parameter to the route
     * @param name Name of the parameter
     * @param type type of the parameter. This field is not required, if the entity has this parameter.
     * @returns self
     */
    addParameter(name, type = null) {
        if (type == null && this.controller instanceof ModelAwareController && this.controller.getModel().hasType(name)) {
            type = this.controller.getModel().getType(name);
        }
        if (type == null) {
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
    getBlock(name) {
        return this.routeBlocks.get(name);
    }
    getBlocks() {
        return this.routeBlocks;
    }
    hasBlock(name) {
        return this.routeBlocks.has(name);
    }
    /**
     * Mathches the route against the particular request.
     *
     * @param request The request to match against.
     * @return True on match.
     */
    match(request) {
        if (this.path == request.getPath()) {
            return true;
        }
        return false;
    }
    getTemplate() {
        return this.templateName;
    }
    getName() {
        return this.name;
    }
}
//# sourceMappingURL=Route.js.map
import { ChildResponse } from "../index.js";
/**
 * A Block is an interchangeble element on the view.
 */
export default class RouteBlock {
    templateName;
    controller;
    /**
     * Creates a new block.
     * @param controller for the block
     * @param template to render the data.
     */
    constructor(controller, template) {
        this.controller = controller;
        this.templateName = template;
    }
    compare(other) {
        return this.controller == other.controller && this.templateName == other.templateName;
    }
    getTemplate() {
        return this.templateName;
    }
    getController() {
        return this.controller;
    }
    render(engine, request, response) {
        if (this.controller) {
            let routedResponse = new ChildResponse(this.controller, response);
            routedResponse.setTemplateName(this.templateName);
            this.controller.render(engine, request, routedResponse);
        }
        else if (this.templateName) {
            let template = engine.getTemplate(this.templateName);
            template.render(engine, request, response);
        }
    }
}
//# sourceMappingURL=Block.js.map
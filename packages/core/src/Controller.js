import { Router } from "./index.js";
export default class Controller {
    router = new Router(this);
    path;
    blockPath;
    constructor() {
        let className = this.constructor.name;
        this.path = className.substring(0, className.length - 10);
        this.buildRouter(this.router);
    }
    buildRouter(router) { }
    /**
     * Gets the Router.
     *
     * @return The router object of the current controller.
     */
    getRouter() {
        return this.router;
    }
    /**
     * Gets the controller relative path to program root.
     *
     * @return The dot separated path
     */
    getPath() {
        return this.path;
    }
    /**
     * All data request mapped here. (GET)
     *
     * @param request Request where the data comes from
     * @param response Response object for this particular view
     */
    view(request, response) { }
    /**
     * Actions modifing data. (POST, PUT, PATCH, DELETE)
     *
     * @param request
     * @param response
     */
    action(request, response) {
    }
    render(renderEngine, request, response) {
        let route = this.router.getRoute(request);
        if (route != null) {
            let template = route.getTemplate();
            if (template != null) {
                response.setTemplateName(template);
            }
        }
        this.view(request, response);
        renderEngine.dispatch(request, response);
    }
    setBlockPath(path) {
        this.blockPath = path;
    }
    /**
     * Returns the position in the tree.
     * @return The path.
     */
    getBlockPath(target) {
        if (target) {
            return this.blockPath ? this.blockPath + "-" + target : target;
        }
        else {
            return this.blockPath;
        }
    }
}
export class ModelAwareController {
    model;
    constructor(model) {
        this.model = model;
    }
    getModel() {
        return this.model;
    }
}
//# sourceMappingURL=Controller.js.map
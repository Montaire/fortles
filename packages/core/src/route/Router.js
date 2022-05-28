import { Route } from "../index.js";
export default class Router {
    routes = [];
    controller;
    defaultRoute;
    constructor(controller) {
        this.controller = controller;
        this.defaultRoute = new Route(null, null, null);
    }
    add(route) {
        this.routes.push(route);
        return this;
    }
    /**
     * Creates a new route.
     * @param name The cannonical name of the route.
     * @param template Name of the template. If null the controller's location and name will be used.
     * @returns The created route.
     */
    createRoute(name, template = null) {
        let route = new Route(name, template || this.controller.getPath(), this.controller);
        this.routes.push(route);
        return route;
    }
    /**
     * Creates a route for an emty cannonical name.
     * @param template Name of the template. If null, the controller's location and name will be used.
     * @returns The created route.
     */
    createDefaultRoute(template = null) {
        if (template) {
            template = '.' + template;
        }
        else {
            template = this.controller.getPath();
        }
        let route = new Route(null, template, this.controller);
        this.routes.push(route);
        this.defaultRoute = route;
        return route;
    }
    /**
     * Creates a route, that has a same template name, as the route's cannonical name.
     * @param name Name of the cannonical route, and the template name as well.
     * @returns The created route.
     */
    createTemplatedRoute(name) {
        let route = new Route(name, '.' + name, this.controller);
        this.routes.push(route);
        return route;
    }
    getRoute(request) {
        for (let route of this.routes) {
            if (route.match(request)) {
                return route;
            }
        }
        return null;
    }
    getDefaultRoute() {
        return this.defaultRoute;
    }
    getRoutes() {
        return this.routes;
    }
    isEmpty() {
        return this.routes.length == 0;
    }
}
//# sourceMappingURL=Router.js.map
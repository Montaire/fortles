import { Controller, Request, Route } from "../index.js";
export default class Router {
    protected routes: Route[];
    protected controller: Controller;
    protected defaultRoute: Route;
    constructor(controller: Controller);
    add(route: Route): this;
    /**
     * Creates a new route.
     * @param name The cannonical name of the route.
     * @param template Name of the template. If null the controller's location and name will be used.
     * @returns The created route.
     */
    createRoute(name: string, template?: string): Route;
    /**
     * Creates a route for an emty cannonical name.
     * @param template Name of the template. If null, the controller's location and name will be used.
     * @returns The created route.
     */
    createDefaultRoute(template?: string): Route;
    /**
     * Creates a route, that has a same template name, as the route's cannonical name.
     * @param name Name of the cannonical route, and the template name as well.
     * @returns The created route.
     */
    createTemplatedRoute(name: string): Route;
    getRoute(request: Request): Route;
    getDefaultRoute(): Route;
    getRoutes(): Route[];
    isEmpty(): boolean;
}

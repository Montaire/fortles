import { Controller, Request, Route } from "../index.js" 

export default class Router {

    protected routes: Route[] = [];
    protected controller: Controller;
    protected defaultRoute: Route;

    public constructor(controller: Controller) {
        this.controller = controller;
        this.defaultRoute = new Route(null, null, null);
    }

    public add(route: Route): this {
        this.routes.push(route);
        return this;
    }

    /**
     * Creates a new route.
     * @param name The cannonical name of the route.
     * @param template Name of the template. If null the controller's location and name will be used.
     * @returns The created route.
     */
    public createRoute(name: string, template: string = null): Route {
        let route = new Route(name, template || this.controller.getPath(), this.controller);
        this.routes.push(route);
        return route;
    }
    
    /**
     * Creates a route for an emty cannonical name.
     * @param template Name of the template. If null, the controller's location and name will be used.
     * @returns The created route.
     */
    public createDefaultRoute(template: string = null): Route{
        if(template){
            template = '.' + template;
        }else{
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
    public createTemplatedRoute(name: string): Route {
        let route = new Route(name, '.' + name, this.controller);
        this.routes.push(route);
        return route;
    }

    public getRoute(request: Request): Route {
        for (let route of this.routes) {
            if (route.match(request)) {
                return route;
            }
        }
        return null;
    }

    public getDefaultRoute(): Route{
        return this.defaultRoute;
    }

    public getRoutes(): Route[]{
        return this.routes;
    }

    public isEmpty(): boolean {
        return this.routes.length == 0;
    }
}
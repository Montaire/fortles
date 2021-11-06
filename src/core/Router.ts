import { Route, Controller, Request } from "./index.js" 

export default class Router {

    routes: Route[] = [];
    controller: Controller;

    public constructor(controller: Controller) {
        this.controller = controller;
    }

    public add(route: Route): this {
        this.routes.push(route);
        return this;
    }

    public createRoute(name: string, template: string): Route {
        let route = new Route(name, template, this.controller);
        this.routes.push(route);
        return route;
    }
    
    public createDefaultRoute(template: string = null): Route{
        let route = new Route(null, template ? '.' + template : null, this.controller);
        this.routes.push(route);
        return route;
    }

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

    public isEmpty(): boolean {
        return this.routes.length == 0;
    }
}
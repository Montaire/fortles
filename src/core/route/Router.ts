import { Route } from "./index.js" 
import { Controller, Request } from "../index.js" 

export default class Router {

    protected routes: Route[] = [];
    protected controller: Controller;

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
        if(template){
            template = '.' + template;
        }else{
            template = this.controller.getPath();
        }
        let route = new Route(null, template, this.controller);
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

    public getRoutes(): Route[]{
        return this.routes;
    }

    public isEmpty(): boolean {
        return this.routes.length == 0;
    }
}
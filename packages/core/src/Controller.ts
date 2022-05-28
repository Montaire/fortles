import { Entity } from "@fortles/model";
import { Router, Response, Request, RenderEngine } from "./index.js";

export default class Controller {

    protected router: Router = new Router(this);
    protected path: string;
    protected blockPath: string;

    public constructor() {
        let className = this.constructor.name;
        this.path = className.substring(0, className.length - 10);
        this.buildRouter(this.router);
    }

    protected buildRouter(router: Router): void{}

    /**
     * Gets the Router.
     *
     * @return The router object of the current controller.
     */
    public getRouter(): Router {
        return this.router;
    }

    /**
     * Gets the controller relative path to program root.
     *
     * @return The dot separated path
     */
    public getPath(): string{
        return this.path;
    }

    /**
     * All data request mapped here. (GET)
     *
     * @param request Request where the data comes from
     * @param response Response object for this particular view
     */
    public view(request: Request, response: Response):void {}

    /**
     * Actions modifing data. (POST, PUT, PATCH, DELETE)
     *
     * @param request
     * @param response
     */
    public action(request: Request, response: Response):void {

    }

    public render(renderEngine: RenderEngine, request: Request, response: Response): void {
        let route = this.router.getRoute(request);
        if(route != null){
            let template = route.getTemplate();
            if(template != null){
                response.setTemplateName(template);
            }
        }
        this.view(request, response);
        renderEngine.dispatch(request, response);
    }

    public setBlockPath(path: string): void{
        this.blockPath = path;
    }

    /**
     * Returns the position in the tree.
     * @return The path.
     */
    public getBlockPath(target?: string): string {
        if(target){
            return this.blockPath ? this.blockPath + "-" + target : target;
        }else{
            return this.blockPath;
        }
    }
}

export class ModelAwareController<E extends typeof Entity>{
    
    protected model: E;

    constructor(model: E){
        this.model = model;
    }

    public getModel(): E{
        return this.model;
    }
}
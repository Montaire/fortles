import { Router, Response, Request } from "./index.js";
import { RenderEngine } from "./render/index.js";

export default class Controller {

    protected router: Router = new Router(this);
    protected path: string;
    protected eUri: string;

    public constructor() {
        let className = this.constructor.name;
        this.path = className.substring(0, className.length - 10);
        this.buildRouter(this.router);
    }

    protected buildRouter(router: Router): void{}
    
    public setEUri(eUri: string): void{
        this.eUri = eUri;
    }

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

    /**
     * Returns the position in the tree in an uri form.
     *
     * @return The e-uri;
     */
    public getEUri(): string {
        return this.eUri;
    }
}
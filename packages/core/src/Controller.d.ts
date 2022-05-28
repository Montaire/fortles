import { Entity } from "@fortles/model";
import { Router, Response, Request, RenderEngine } from "./index.js";
export default class Controller {
    protected router: Router;
    protected path: string;
    protected blockPath: string;
    constructor();
    protected buildRouter(router: Router): void;
    /**
     * Gets the Router.
     *
     * @return The router object of the current controller.
     */
    getRouter(): Router;
    /**
     * Gets the controller relative path to program root.
     *
     * @return The dot separated path
     */
    getPath(): string;
    /**
     * All data request mapped here. (GET)
     *
     * @param request Request where the data comes from
     * @param response Response object for this particular view
     */
    view(request: Request, response: Response): void;
    /**
     * Actions modifing data. (POST, PUT, PATCH, DELETE)
     *
     * @param request
     * @param response
     */
    action(request: Request, response: Response): void;
    render(renderEngine: RenderEngine, request: Request, response: Response): void;
    setBlockPath(path: string): void;
    /**
     * Returns the position in the tree.
     * @return The path.
     */
    getBlockPath(target?: string): string;
}
export declare class ModelAwareController<E extends typeof Entity> {
    protected model: E;
    constructor(model: E);
    getModel(): E;
}

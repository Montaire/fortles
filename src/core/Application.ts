import { Controller, Request, RequestType, Response, Middleware, Addon, Platform } from "./index.js";
import Locale from "./localization/Locale.js";
import { RenderEngine, HtmlRenderEngine } from "./render/index.js";

/**
 * Application is the main entrnance point.
 */
export default class Application{
	protected platform: Platform;
	protected mainController: Controller;
	protected renderEngines: Map<string, RenderEngine> = new Map();
    protected middlewareQueue: Middleware[] = [];
    protected addons: Addon[] = [];

    /**
     * Creates a new application for the given platform.
     * @param platform 
     */
    constructor(platform: Platform, mainController: Controller){
        this.platform = platform;
        this.mainController = mainController;
        this.renderEngines.set('text/html', new HtmlRenderEngine());
    }

    /**
     * Starts the application.
     */
    public run(): void{
        this.platform.run(this);
    }

    /**
     * At each request this function should be called form the given Platform
     * @param request 
     * @param response 
     */
    dispatch(request: Request, response: Response): void{
        // run middlewares
        for(let middleware of this.middlewareQueue){
            if(!middleware.run(request, response)){
                return;
            }
        }
        let engine = this.getRenderEngine(request);
        switch(request.getType()){
            case RequestType.FULL:
                engine.beforeDispatch(request, response);
                engine.dispatch(request, response);
                engine.afterDispatch(request, response);
                break;
        }
        response.close();
    }

    /**
     * Gets the render engine from the mime type
     * @param request 
     */
    getRenderEngine(request: Request): RenderEngine{
        return this.renderEngines.get(request.getMime());
    }

    /**
     * Gets the main controller of the applcation.
     * @returns The main controller.
     */
    getMainController(): Controller{
        return this.mainController;
    }

    /**
     * Adds an addon to the Application.
     * @param addon Instance of the addon.
     * @returns Self for chaining functions.
     */
    public addAddon(addon: Addon): this{
        this.addons.push(addon);
        addon.prepare(this);
        return this;
    }

    /**
     * Adds a middleware to the middleware queue.
     * The position of the middleware will be the last among the same priority.
     * Default priority is 100.
     * @param middleware Middleware to add.
     * @returns Self for chaining functions.
     */
    public addMiddleware(middleware: Middleware): this{
        for(let i = 0; i < this.middlewareQueue.length; i++){
            if(middleware.getPriority() > this.middlewareQueue[i].getPriority()){
                this.middlewareQueue.splice(i, 0, middleware);
                return this;
            }
        }
        this.middlewareQueue.push(middleware);
        return this;
    }

    static getLocale(code: string): Locale|null{
        return null;
    }

    static getDefaultLocale(){
        return null;
    }
}
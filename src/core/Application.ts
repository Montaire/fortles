import { Controller, Request, RequestType, Response, Middleware, Addon, Platform, Asset, ServiceManager, Service, ServiceType } from "./index.js";
import Locale from "./localization/Locale.js";
import { RenderEngine, HtmlRenderEngine } from "./render/index.js";

/**
 * Application is the main entrnance point.
 * It can be decorated with addons.
 */
export class Application{
	protected platform: Platform;
	protected mainController: Controller;
	protected renderEngines: Map<string, RenderEngine> = new Map();
    protected middlewareQueue: Middleware[] = [];
    protected addons = new Map<new() => Addon, Addon>();
    protected serviceManager = new ServiceManager();
    protected static instance: Application;

    /**
     * Creates a new application for the given platform.
     * @param platform 
     */
    constructor(platform: Platform, mainController: Controller){
        this.platform = platform;
        this.mainController = mainController;
        this.renderEngines.set('text/html', new HtmlRenderEngine());
        this.addMiddleware(this.serviceManager);
        Application.instance = this;
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
    public dispatch(request: Request, response: Response): void{
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
    public getRenderEngine(request: Request): RenderEngine{
        return this.renderEngines.get(request.getMime());
    }

    /**
     * Returns the whole map of the render engines.
     * Engines can be added or remved here.
     * @returns Map of the render engines
     */
    public getRenderEngines(): Map<string, RenderEngine>{
        return this.renderEngines;
    }

    /**
     * Gets the main controller of the applcation.
     * @returns The main controller.
     */
    public getMainController(): Controller{
        return this.mainController;
    }

    /**
     * Adds an addon to the Application.
     * @param addon Instance of the addon.
     * @returns Self for chaining functions.
     */
    /*public addAddon(addon: Addon): this{
        this.addons.push(addon);
        addon.prepareAddon(this);
        return this;
    }*/

    /**
     * Adds an addon to the Application.
     * @param addon Instance of the addon.
     * @returns Self for chaining functions.
     */
     public registerAddon(addonType: new() => Addon): this{
        if(!this.addons.has(addonType)){
            let addon = new addonType();
            addon.prepareAddon(this);
            this.addons.set(addonType, addon);
        }
        return this;
    }

    /**
     * Gets a service.
     * @see {@link ServiceManager}
     * @returns An instance of the Service, or null if not loaded or not exists.
     */
    public getService<T extends Service>(serviceType: ServiceType<T>): T | null{
        return this.serviceManager.get(serviceType) as T;
    }

    /**
     * Registers a new service, if it is exists already just return it.
     * @param serviceType
     * @returns 
     */
    public registerService<T extends Service>(serviceType: ServiceType<T>): T{
        return this.serviceManager.register(serviceType);
    }

    public addService(service: Service): this{
        this.serviceManager.add(service);
        return this;
    }

    public getServiceManager(): ServiceManager{
        return this.serviceManager;
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

    static getInstance(): Application{
        return this.instance;
    }
}

export default Application.getInstance();
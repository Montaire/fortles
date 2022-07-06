import { Connection, Model } from "@fortles/model";
import { resolve } from "path";
import { pathToFileURL } from "url";
import { TemplateRenderEngine, Controller, Request, RequestType, Route, 
    Block, Response, Middleware, Addon, Platform, ServiceManager, Service, 
    ServiceType, RenderEngine, DummyRequest, Plugin, NotFoundError, Registrable } from "./index.js";
import Locale from "./localization/Locale.js";

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
    protected plugins = new Map<new() => Plugin, Plugin>();
    protected serviceManager: ServiceManager;
    protected static instance: Application;
    protected model: Model;

    /**
     * Creates a new application for the given platform.
     * @param platform 
     */
    constructor(platform: Platform, mainController: Controller){
        Application.instance = this;
        this.platform = platform;
        this.mainController = mainController;
        this.serviceManager = new ServiceManager(this);
        this.addMiddleware(this.serviceManager);
        this.platform.prepare(this);
        this.model = new Model();
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
                engine.beforeRender(request, response);
                this.mainController.render(engine, request, response);
                engine.afterRender(request, response);
                break;
            case RequestType.PARTIAL:
                this.renderPartial(engine, request, response);
                break;
            case RequestType.BLOCK:
                this.renderBlock(engine, request, response);
                break;
            case RequestType.ACTION:
                
                break;
        }
        response.close();
    }

    protected renderBlock(engine: RenderEngine, request: Request, response: Response): void{
        let controller = this.mainController;
        let block: Block = null;
        if(request.getBlockPath()){
            for(const name of request.getBlockPath().split("-")){
                block = controller.getRouter().getRoute(request).getBlock(name);
                if(!block){
                    throw new NotFoundError("Block not found");
                }
                if(controller){
                    controller = block.getController();
                }
            }
        }
        if(block && engine instanceof TemplateRenderEngine){
            response.setBlockPath(request.getBlockPath());
            block.render(engine, request, response);
        }else{
            response.setBlockPath(controller.getBlockPath());
            controller.render(engine, request, response);
        }
    }

    protected renderPartial(engine: RenderEngine, request: Request, response: Response): void{
        let oldRequest = new DummyRequest(request.getReferer());
        let newRoute: Route;
        let oldRoute: Route;
        let newController = this.mainController;
        let oldController = this.mainController;
        for(const name of request.getBlockPath().split("-")){
            newRoute = newController.getRouter().getRoute(request);
            oldRoute = oldController.getRouter().getRoute(oldRequest);
            if(newRoute != oldRoute){
                //Check for block changes.
                let changedBlock: Block = null;
                let changedBlockName: string;
                for(const [key, block] of newRoute.getBlocks()){
                    if(!oldRoute.hasBlock(key) || !block.compare(oldRoute.getBlock(key))){
                        //If more than one block differs, render the whole controller.
                        if(changedBlock){
                            changedBlock = null;
                            break;
                        }
                        changedBlock = block;
                        changedBlockName = key;
                    }
                }
                //If only one block changed render only that one.
                if(changedBlock && engine instanceof TemplateRenderEngine){
                    response.setBlockPath(newController.getBlockPath(changedBlockName));
                    changedBlock.render(engine, request, response);
                }else{
                    response.setBlockPath(newController.getBlockPath());
                    newController.render(engine, request, response);
                }
                return;
            }
            let newBlock = newRoute.getBlock(name);
            let oldBlock = oldRoute.getBlock(name);
            newController = newBlock.getController();
            oldController = oldBlock.getController();
        }
        return null;
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
     * Register an addon, servce or plugin, or any registrable
     * @param registerable 
     * @returns Self for chaining.
     */
    public register(registerable: new() => Registrable): this{
        let instance = new registerable();
        if(instance instanceof Service){
            instance = this.serviceManager.register(registerable as typeof Service);
            return this;
        }
        if(instance instanceof Plugin){
            if(!this.plugins.has(registerable)){
                this.plugins.set(registerable, instance as Plugin);
            }
            return this;
        }
        //If not Service, neither Plugin, it must be an addon.
        if(!this.addons.has(registerable)){
            this.addons.set(registerable, instance);
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
    protected registerService<T extends Service>(serviceType: ServiceType<T>): T{
        return this.serviceManager.register(serviceType);
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

    public getPlatform(): Platform{
        return this.platform;
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

    /**
     * Creates an applicaton from a project path.
     * @param path Path to the project
     * @param platform Platform to run on
     * @returns An application promise
     */
    public static async create(platform: Platform = null, path: string = null): Promise<Application>{
        let rootPath = process.cwd();
        let pathUrl = pathToFileURL(path ? resolve(rootPath, path) : rootPath);
        let mainController: Controller = null;
        let configUrl = pathUrl + "/src/config.js";
        let config = null;

        try{
            config = await import(pathUrl + "/src/config.js");
            if(config.mainController instanceof Function){
                mainController = config.mainController();
            }
        } catch (error){
            console.warn("Configuration file not found at '" + configUrl + "'");
        }

        if(mainController == null){
            let mainControllerUrl = pathUrl + "/src/controller/MainController.js";
            try{
                mainController = (await import(mainControllerUrl)).default;
            } catch (error){
                console.error("Main Controller not found at '" + mainControllerUrl + "' nor in hte config. Call this script from the root of your project.");
                process.exit();
            }
        }

        let application = new Application(platform, mainController);

        if(config && config.default){
            config.default(application);
        }else{
            console.log(config);
            console.warn("No default export found in the config file: '" + configUrl + "'");
        }

        return application;
    }
}

export default Application.getInstance();
import { TemplateRenderEngine, ServiceManager, Service, DummyRequest, Plugin, NotFoundError } from "./index.js";
/**
 * Application is the main entrnance point.
 * It can be decorated with addons.
 */
export class Application {
    platform;
    mainController;
    renderEngines = new Map();
    middlewareQueue = [];
    addons = new Map();
    plugins = new Map();
    serviceManager;
    static instance;
    /**
     * Creates a new application for the given platform.
     * @param platform
     */
    constructor(platform, mainController) {
        Application.instance = this;
        this.platform = platform;
        this.mainController = mainController;
        this.serviceManager = new ServiceManager(this);
        this.addMiddleware(this.serviceManager);
        this.platform.prepare(this);
    }
    /**
     * Starts the application.
     */
    run() {
        this.platform.run(this);
    }
    /**
     * At each request this function should be called form the given Platform
     * @param request
     * @param response
     */
    dispatch(request, response) {
        // run middlewares
        for (let middleware of this.middlewareQueue) {
            if (!middleware.run(request, response)) {
                return;
            }
        }
        let engine = this.getRenderEngine(request);
        switch (request.getType()) {
            case 0 /* RequestType.FULL */:
                engine.beforeRender(request, response);
                this.mainController.render(engine, request, response);
                engine.afterRender(request, response);
                break;
            case 1 /* RequestType.PARTIAL */:
                this.renderPartial(engine, request, response);
                break;
            case 3 /* RequestType.BLOCK */:
                this.renderBlock(engine, request, response);
                break;
            case 2 /* RequestType.ACTION */:
                break;
        }
        response.close();
    }
    renderBlock(engine, request, response) {
        let controller = this.mainController;
        let block = null;
        if (request.getBlockPath()) {
            for (const name of request.getBlockPath().split("-")) {
                block = controller.getRouter().getRoute(request).getBlock(name);
                if (!block) {
                    throw new NotFoundError("Block not found");
                }
                if (controller) {
                    controller = block.getController();
                }
            }
        }
        if (block && engine instanceof TemplateRenderEngine) {
            response.setBlockPath(request.getBlockPath());
            block.render(engine, request, response);
        }
        else {
            response.setBlockPath(controller.getBlockPath());
            controller.render(engine, request, response);
        }
    }
    renderPartial(engine, request, response) {
        let oldRequest = new DummyRequest(request.getReferer());
        let newRoute;
        let oldRoute;
        let newController = this.mainController;
        let oldController = this.mainController;
        for (const name of request.getBlockPath().split("-")) {
            newRoute = newController.getRouter().getRoute(request);
            oldRoute = oldController.getRouter().getRoute(oldRequest);
            if (newRoute != oldRoute) {
                //Check for block changes.
                let changedBlock = null;
                let changedBlockName;
                for (const [key, block] of newRoute.getBlocks()) {
                    if (!oldRoute.hasBlock(key) || !block.compare(oldRoute.getBlock(key))) {
                        //If more than one block differs, render the whole controller.
                        if (changedBlock) {
                            changedBlock = null;
                            break;
                        }
                        changedBlock = block;
                        changedBlockName = key;
                    }
                }
                //If only one block changed render only that one.
                if (changedBlock && engine instanceof TemplateRenderEngine) {
                    response.setBlockPath(newController.getBlockPath(changedBlockName));
                    changedBlock.render(engine, request, response);
                }
                else {
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
    getRenderEngine(request) {
        return this.renderEngines.get(request.getMime());
    }
    /**
     * Returns the whole map of the render engines.
     * Engines can be added or remved here.
     * @returns Map of the render engines
     */
    getRenderEngines() {
        return this.renderEngines;
    }
    /**
     * Gets the main controller of the applcation.
     * @returns The main controller.
     */
    getMainController() {
        return this.mainController;
    }
    /**
     * Register an addon, servce or plugin, or any registrable
     * @param registerable
     * @returns Self for chaining.
     */
    register(registerable) {
        let instance = new registerable();
        if (instance instanceof Service) {
            instance = this.serviceManager.register(registerable);
            return this;
        }
        if (instance instanceof Plugin) {
            if (!this.plugins.has(registerable)) {
                this.plugins.set(registerable, instance);
            }
            return this;
        }
        //If not Service, neither Plugin, it must be an addon.
        if (!this.addons.has(registerable)) {
            this.addons.set(registerable, instance);
        }
        return this;
    }
    /**
     * Gets a service.
     * @see {@link ServiceManager}
     * @returns An instance of the Service, or null if not loaded or not exists.
     */
    getService(serviceType) {
        return this.serviceManager.get(serviceType);
    }
    /**
     * Registers a new service, if it is exists already just return it.
     * @param serviceType
     * @returns
     */
    registerService(serviceType) {
        return this.serviceManager.register(serviceType);
    }
    getServiceManager() {
        return this.serviceManager;
    }
    /**
     * Adds a middleware to the middleware queue.
     * The position of the middleware will be the last among the same priority.
     * Default priority is 100.
     * @param middleware Middleware to add.
     * @returns Self for chaining functions.
     */
    addMiddleware(middleware) {
        for (let i = 0; i < this.middlewareQueue.length; i++) {
            if (middleware.getPriority() > this.middlewareQueue[i].getPriority()) {
                this.middlewareQueue.splice(i, 0, middleware);
                return this;
            }
        }
        this.middlewareQueue.push(middleware);
        return this;
    }
    getPlatform() {
        return this.platform;
    }
    static getLocale(code) {
        return null;
    }
    static getDefaultLocale() {
        return null;
    }
    static getInstance() {
        return this.instance;
    }
    setConnection(connection, name = null) {
        return this;
    }
    getConnection(name = null) {
        return null;
    }
}
export default Application.getInstance();
//# sourceMappingURL=Application.js.map
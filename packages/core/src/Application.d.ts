import { Connection } from "@fortles/model";
import { Controller, Request, Response, Middleware, Addon, Platform, ServiceManager, Service, ServiceType, RenderEngine, Plugin, Registrable } from "./index.js";
import Locale from "./localization/Locale.js";
/**
 * Application is the main entrnance point.
 * It can be decorated with addons.
 */
export declare class Application {
    protected platform: Platform;
    protected mainController: Controller;
    protected renderEngines: Map<string, RenderEngine>;
    protected middlewareQueue: Middleware[];
    protected addons: Map<new () => Addon, Addon>;
    protected plugins: Map<new () => Plugin, Plugin>;
    protected serviceManager: ServiceManager;
    protected static instance: Application;
    /**
     * Creates a new application for the given platform.
     * @param platform
     */
    constructor(platform: Platform, mainController: Controller);
    /**
     * Starts the application.
     */
    run(): void;
    /**
     * At each request this function should be called form the given Platform
     * @param request
     * @param response
     */
    dispatch(request: Request, response: Response): void;
    protected renderBlock(engine: RenderEngine, request: Request, response: Response): void;
    protected renderPartial(engine: RenderEngine, request: Request, response: Response): void;
    /**
     * Gets the render engine from the mime type
     * @param request
     */
    getRenderEngine(request: Request): RenderEngine;
    /**
     * Returns the whole map of the render engines.
     * Engines can be added or remved here.
     * @returns Map of the render engines
     */
    getRenderEngines(): Map<string, RenderEngine>;
    /**
     * Gets the main controller of the applcation.
     * @returns The main controller.
     */
    getMainController(): Controller;
    /**
     * Register an addon, servce or plugin, or any registrable
     * @param registerable
     * @returns Self for chaining.
     */
    register(registerable: new () => Registrable): this;
    /**
     * Gets a service.
     * @see {@link ServiceManager}
     * @returns An instance of the Service, or null if not loaded or not exists.
     */
    getService<T extends Service>(serviceType: ServiceType<T>): T | null;
    /**
     * Registers a new service, if it is exists already just return it.
     * @param serviceType
     * @returns
     */
    protected registerService<T extends Service>(serviceType: ServiceType<T>): T;
    getServiceManager(): ServiceManager;
    /**
     * Adds a middleware to the middleware queue.
     * The position of the middleware will be the last among the same priority.
     * Default priority is 100.
     * @param middleware Middleware to add.
     * @returns Self for chaining functions.
     */
    addMiddleware(middleware: Middleware): this;
    getPlatform(): Platform;
    static getLocale(code: string): Locale | null;
    static getDefaultLocale(): any;
    static getInstance(): Application;
    setConnection(connection: Connection, name?: string): this;
    getConnection(name?: string): Connection;
}
declare const _default: Application;
export default _default;

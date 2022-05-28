import { Middleware, Request, Response, Service, ServiceType, ServiceContainer, Application } from "../index.js";
export default class ServiceManager extends ServiceContainer<null> implements Middleware {
    protected serviceMap: Map<ServiceType<Service<ServiceContainer<ServiceManager>>>, Service<ServiceContainer<ServiceManager>>>;
    protected application: Application;
    constructor(application: Application);
    run(request: Request, response: Response): boolean;
    getPriority(): number;
    register<T extends Service>(serviceType: ServiceType<T>): T;
    /**
     * This method will return the Service object.
     * @param serviceType The static identifier of the service
     * @returns The service if loaded othervise null.
     */
    get<T extends Service>(serviceType: ServiceType<T> | null): T;
    has(serviceType: ServiceType): boolean;
}

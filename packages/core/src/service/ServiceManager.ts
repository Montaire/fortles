
import { Middleware, Request, Response, Service, ServiceType, ServiceContainer, Application} from "../index.js";
import { RequestEventListener } from "./Service.js";

export default class ServiceManager extends ServiceContainer implements Middleware{

    protected serviceMap = new Map<ServiceType, Service>();

    protected application: Application;

    constructor(application: Application){
        super();
        this.application = application;
    }

    public run(request: Request, response: Response): boolean {
        //Check direct match;
        let path = request.getPath();
        if(!path){
            return false;
        }
        if(this.fullPathMap.has(path)){
            let service = this.fullPathMap.get(path) as Service;
            service.onRequest(request, response, path, null);
            return false;
        }
        let pos = path.indexOf('/', 1);
        if(pos != -1){
            let partialPath = path.substring(1, pos);
            if(this.partialPathMap.has(partialPath)){
                let service = this.partialPathMap.get(partialPath) as Service;
                service.onRequest(request, response, path.substring(pos + 1), partialPath);
                return false;
            }
        }
        return true;
    }

    public getPriority(): number {
        return 102;
    }

    public register<T extends Service>(serviceType: ServiceType<T>): T{
        if(this.serviceMap.has(serviceType)){
            return this.serviceMap.get(serviceType) as T;
        }else{
            let service = new serviceType();
            let containerType = service.getContainerType();
            if(containerType){
                let container = this.register(containerType);
                service.setContainer(container);
            }else{
                service.setContainer(this);
            }
            service.prepare(this.application);
            this.serviceMap.set(serviceType, service);
            return service;
        }
    }

    /**
     * This method will return the Service object.
     * @param serviceType The static identifier of the service
     * @returns The service if loaded othervise null.
     */
    public get<T extends Service>(serviceType: ServiceType<T>): T{
        return this.serviceMap.get(serviceType) as T;
    }

    public has(serviceType: ServiceType): boolean{
        return this.serviceMap.has(serviceType);
    }
}
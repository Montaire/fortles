
import { Middleware, Request, Response, Service, ServiceType, ServiceContainer, Application} from "../index.js";
import { RequestEventListener } from "./Service.js";

export default class ServiceManager extends ServiceContainer<null> implements Middleware{

    protected serviceMap = new Map<ServiceType, Service>();

    protected application: Application;

    constructor(application: Application){
        super();
        this.application = application;
    }

    public run(request: Request, response: Response): boolean {
        //Check direct match;
        let path = request.getPath();
        if(this.fullPathMap.has(path)){
            let service = this.fullPathMap.get(path);
            service.onRequest(request, response, path, null);
            return false;
        }
        let pos = path.indexOf('/', 1);
        if(pos != -1){
            let partialPath = path.substring(1, pos);
            if(this.partialPathMap.has(partialPath)){
                let service = this.partialPathMap.get(partialPath);
                service.onRequest(request, response, path.substring(pos), partialPath);
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
                let container = this.register<any>(containerType);
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
     * Adds a new service, if it is not added already.
     * @param service The service to be added.
     * @returns If the service is already added, return the added instance.
     */
    /*public add(service: Service): Service{
        let container = service.createContainer();
        if(container != null){
            //Recursively add all container.
            container = this.add(container) as ServiceContainer;
            container.add(service);
        }
        //initialize service after the structure is built.
        this.serviceMap.set(typeof service, service);
        service.prepare(app);
        return service;
    }*/

    /**
     * This method will return the Service object.
     * @param serviceType The static identifier of the service
     * @returns The service if loaded othervise null.
     */
    public get<T extends Service>(serviceType: ServiceType<T> | null): T{
        return this.serviceMap.get(serviceType) as T;
    }

    public has(serviceType: ServiceType): boolean{
        return this.serviceMap.has(serviceType);
    }
}
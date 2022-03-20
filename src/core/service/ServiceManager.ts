import { Middleware, Request, Response } from "../index.js";
import Service from "./Service.js";
import ServiceContainer from "./ServiceContainer.js";

export default class ServiceManager extends ServiceContainer implements Middleware{

    protected serviceMap = new Map<string, Service>();

    public run(request: Request, response: Response): boolean {
        //Check direct match;
        let path = request.getPath();
        if(this.fullPathMap.has(path)){
            return true;
        }
        let pos = path.indexOf('/');
        if(pos != -1){
            let partialPath = path.substring(0, pos + 1);
            if(this.partialPathMap.has(partialPath)){
                let service = this.partialPathMap.get(partialPath);
                return true;
            }
        }

        return false;
    }

    public getPriority(): number {
        return 102;
    }

    /**
     * Adds a new service, if it is not added already.
     * @param service The service to be added.
     * @returns If the service is already added, return the added instance.
     */
    public add(service: Service): Service{
        let container = service.createContainer();
        if(container != null){
            //Recursively add all container.
            container = this.add(container) as ServiceContainer;
            container.add(service);
        }
        //initialize service after the structure is built.
        this.serviceMap.set(typeof service, service);
        service.initialize();
        return service;
    }

    /**
     * This method will return the Service object.
     * @param serviceType The static identifier of the service
     * @returns The service if loaded othervise null.
     */
    public get<T extends Service>(serviceType: new() => T): T | null{
        return this.serviceMap.get(serviceType.name) as T;
    }
}
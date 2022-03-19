import { Middleware, Request, Response } from "../index.js";
import Service from "./Service.js";

export default class ServiceManager extends Service implements Middleware{

    public run(request: Request, response: Response): boolean {
        //Check direct match;
        let path = request.getPath();
        if(this.directPathMap.has(path)){
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
        if(this.serviceMap.has(typeof service)){
            return this.serviceMap.get(typeof service);
        }
        this.serviceMap.set(typeof service, service);
        for(const path of service.getDirectPaths()){
            this.directPathMap.set(path, service);
        }
        let container = service.getContainer();
        if(container == null){
            for(const path of service.getPartialPaths()){
                this.partialPathMap.set(path, service);
            }
        }else{
            container.add(service);
            //Recursively add all container.
            this.add(service.getContainer());
        }
        return service;
    }

    public get<T extends Service>(serviceType: new() => T): T{
        return this.serviceMap.get(serviceType.name) as T;
    }
}
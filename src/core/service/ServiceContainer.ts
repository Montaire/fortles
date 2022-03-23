import EventHandler from "../event/EventHandler.js";
import { Request, Response, Service, RequestEventListener } from "../index.js";
import ServiceManager from "./ServiceManager.js";

/**
 * A service contaner can hold multiple services, and runs the shared code.s
 */
export default class ServiceContainer<SC extends ServiceContainer<any> | null = ServiceManager> extends Service<SC>{

    protected fullPathMap = new Map<string, Service>();
    protected partialPathMap = new Map<string, Service>();

    public onRequest(request: Request, response: Response, path: string, partialPath: string): void {
        if(partialPath && this.partialPathMap.has(partialPath)){
            let service = this.partialPathMap.get(partialPath);
            service.onRequest(request, response, path, partialPath);
        }
        if(path && this.fullPathMap.has(path)){
            let service = this.fullPathMap.get(path);
            service.onRequest(request, response, path, path);
        }
    }

    add(service: Service): void{

    }
    
    protected getFullPaths(): Iterable<string>{
        return this.fullPathMap.keys();
    }

    protected getPartialPaths(): Iterable<string>{
        return this.partialPathMap.keys();
    }

    public getContainerType(): new() => SC | null {
        return null;
    }

    public listenOnPartialPath(path: string, target: Service = null): void {
        this.partialPathMap.set(path, target);
    }

    public listenOnFullPath(path: string, useRoot: boolean = false, target: Service = null): void {
        if(useRoot && this.container){
            //If container has parent, send the listener to the root ServiceManager
            this.container.listenOnFullPath(path, useRoot, target);
        }else{
            this.fullPathMap.set(path, target);
        }
    }
}
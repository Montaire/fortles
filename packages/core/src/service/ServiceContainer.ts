import { Request, Response, Service, ServiceManager } from "../index.js";

/**
 * A service contaner can hold multiple services, and runs the shared code.s
 */
export default class ServiceContainer<SC extends ServiceContainer<any> | null = ServiceManager> extends Service<SC>{

    protected fullPathMap = new Map<string, Service>();
    protected partialPathMap = new Map<string, Service>();

    public override onRequest(request: Request, response: Response, path: string, partialPath: string): void {
        if(path && this.fullPathMap.has(path)){
            let service = this.fullPathMap.get(path);
            service.onRequest(request, response, path, path);
            return;
        }
        let pos = path.indexOf('/', 1);
        if(pos != -1){
            let partialPath = path.substring(1, pos);
            if(this.partialPathMap.has(partialPath)){
                let service = this.partialPathMap.get(partialPath);
                service.onRequest(request, response, path.substring(pos + 1), partialPath);
            }
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

    public override listenOnPartialPath(path: string, target: Service = null): void {
        if(target || !this.container){
            this.partialPathMap.set(path, target);
        }else{
            this.container.listenOnPartialPath(path, this);
        }
    }

    public override listenOnFullPath(path: string, useRoot: boolean = false, target: Service = null): void {
        if((useRoot || !target) && this.container){
            //If container has parent, send the listener to the root ServiceManager
            this.container.listenOnFullPath(path, useRoot, target || this);
        }else{
            this.fullPathMap.set(path, target);
        }
    }
}
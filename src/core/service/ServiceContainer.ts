import { Request, Response, Service } from "../index.js";

/**
 * A service contaner can hold multiple services, and runs the shared code.s
 */
export default class ServiceContainer extends Service{

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
}
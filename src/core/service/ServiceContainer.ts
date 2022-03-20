import Service from "./Service.js";

/**
 * A service contaner can hold multiple services, and runs the shared code.s
 */
export default class ServiceContainer extends Service{

    protected fullPathMap = new Map<string, Service>();
    protected partialPathMap = new Map<string, Service>()

    add(service: Service): void{

    }
    
    protected getFullPaths(): Iterable<string>{
        return this.fullPathMap.keys();
    }

    protected getPartialPaths(): Iterable<string>{
        return this.partialPathMap.keys();
    }
}
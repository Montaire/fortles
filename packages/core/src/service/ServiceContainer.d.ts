import { Request, Response, Service, ServiceManager } from "../index.js";
/**
 * A service contaner can hold multiple services, and runs the shared code.s
 */
export default class ServiceContainer<SC extends ServiceContainer<any> | null = ServiceManager> extends Service<SC> {
    protected fullPathMap: Map<string, Service<ServiceContainer<ServiceManager>>>;
    protected partialPathMap: Map<string, Service<ServiceContainer<ServiceManager>>>;
    onRequest(request: Request, response: Response, path: string, partialPath: string): void;
    add(service: Service): void;
    protected getFullPaths(): Iterable<string>;
    protected getPartialPaths(): Iterable<string>;
    listenOnPartialPath(path: string, target?: Service): void;
    listenOnFullPath(path: string, useRoot?: boolean, target?: Service): void;
}

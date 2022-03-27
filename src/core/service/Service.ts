import { Request, Response, Application, app, ServiceContainer, DefaultServiceContainer } from "../index.js";

export type RequestEventListener = (request: Request, response: Response, path: string, partialPath: string|null) => void

export type ServiceType<T extends Service = Service> = new() => T;

export default class Service<SC extends ServiceContainer<any> | null = ServiceContainer>{

    protected container: SC;

    /**
     * Do preparation logic here.
     * This function is called, after the Service is mounted. 
     * The containers is avaialble at this moment.
     */
    public prepare(application: Application): void{

    }

    /**
     * Override this method if the service should do something if a request is received.
     * @param request Received request.
     * @param response Response to write.
     */
    public onRequest(request: Request, response: Response, path: string, partialPath: string|null): void{}

    /**
     * Listen on a full path (without the query part) of the incoming requests.
     * The {@link onRequest} method will triggered if no listener specified.
     * @param path Full path without the leading '/'.
     * @param useRoot Not includes the container's partial path.
     * @param listener This function will be called on request. Default `null`.
     */
    protected listenOnFullPath(path: string, useRoot: boolean = false): void{
        this.container.listenOnFullPath(path, useRoot, this);
    }

    /**
     * Listen on the first part of the path before '/' character of the incoming requests.
     * If the request comes trough its container via the same method, it will be listening
     * on the url part after the one that the container consumed.
     * The {@link onRequest} method will triggered if no listener specified.
     * @param path Path neither with the leading '/', nor with parts that has been already consumed by other {@link ServiceContainer}s.
     * @param listener This function will be called on request. Default `null`.
     */
    protected listenOnPartialPath(path: string): void{
        this.container.listenOnPartialPath(path, this);
    }

    /**
     * @returns The parent container.
     */
    public getContainer(): SC|null{
        return this.container;
    }

    public setContainer(container: SC){
        this.container = container;
    }

    public getContainerType(): new() => SC | null{
        return DefaultServiceContainer as any;
    }

}
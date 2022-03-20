import ServiceManager from "./ServiceManager";
import { Request, Response } from "../index.js";
import ServiceContainer from "./ServiceContainer";

export type RequestEventListener = (request: Request, response: Response) => void

export default class Service{

    private fullPathListenerMap = new Map<string, RequestEventListener|null>();
    private partialPathListenerMap = new Map<string, RequestEventListener|null>();
    protected container: ServiceContainer;

    public initialize(): void{

    }

    /**
     * Override this method if the service should do something if a request is received.
     * @param request Received request.
     * @param response Response to write.
     */
    public onRequest(request: Request, response: Response): void{}
    
    /**
     * If the container does not exists of the service already, this function will be called.
     * @returns The new service.
     */
    public createContainer(): ServiceContainer{
        return new ServiceContainer();
    }

    /**
     * Listen on a full path (without the query part) of the incoming requests.
     * The {@link onRequest} method will triggered if no listener specified.
     * @param path Full path without the leading '/'.
     * @param useContainersPath Includes the container's partial path as well.
     * @param listener This function will be called on request. Default `null`.
     */
    protected listenOnFullPath(path: string, useContainersPath: boolean = true, listener: RequestEventListener = null): void{
        this.fullPathListenerMap.set(path, listener);
    }

    /**
     * Listen on the first part of the path before '/' character of the incoming requests.
     * If the request comes trough its container via the same method, it will be listening
     * on the url part after the one that the container consumed.
     * The {@link onRequest} method will triggered if no listener specified.
     * @param path Path neither with the leading '/', nor with parts that has been already consumed by other {@link ServiceContainer}s.
     * @param listener This function will be called on request. Default `null`.
     */
    protected listenOnPartialPath(path: string, listener: RequestEventListener = null): void{
        if(this.container){
            this.container.listenOnFullPath(path);
        }
    }

}
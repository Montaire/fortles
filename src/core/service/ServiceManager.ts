import { Middleware, Request, Response } from "../index.js";
import Service from "./Service.js";

export default class ServiceManager extends Service implements Middleware{

    run(request: Request, response: Response): boolean {
        throw new Error("Method not implemented.");
    }

    getPriority(): number {
        throw new Error("Method not implemented.");
    }

    protected urlMap = new Map<string, Service>();
    protected serviceMap = new Map<typeof Service, Service>();

    add(service: Service){
        if(service.getUrl() !== null){
            this.urlMap.set(service.getUrl(), service);
        }
    }
}
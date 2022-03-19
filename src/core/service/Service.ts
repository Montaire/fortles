import ServiceManager from "./ServiceManager";
import { Request, Response } from "../index.js";
import ServiceContainer from "./ServiceContainer";

export default class Service{

    protected serviceMap = new Map<string, Service>();

    protected directPathMap = new Map<string, Service>();
    protected partialPathMap = new Map<string, Service>();

    getManagerType(): typeof ServiceManager{
        return ServiceManager;
    }

    public getDirectPaths(): string[]{
        return [];
    }

    public getPartialPaths(): string[]{
        return [];
    }

    public onRequest(request: Request, response: Response): void{

    }

    protected getContainer(): ServiceContainer{
        return new ServiceContainer();
    }

    protected addDirectPath(path: string): void{

    }

    protected addPartialPath(path: string): void{
        
    }
}
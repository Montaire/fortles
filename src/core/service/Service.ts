import ServiceManager from "./ServiceManager";

export default class Service{
    getManagerType(): typeof ServiceManager{
        return ServiceManager;
    }

    public getUrl(): string{
        return null;
    }
}
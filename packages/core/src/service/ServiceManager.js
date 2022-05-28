import { ServiceContainer } from "../index.js";
export default class ServiceManager extends ServiceContainer {
    serviceMap = new Map();
    application;
    constructor(application) {
        super();
        this.application = application;
    }
    run(request, response) {
        //Check direct match;
        let path = request.getPath();
        if (this.fullPathMap.has(path)) {
            let service = this.fullPathMap.get(path);
            service.onRequest(request, response, path, null);
            return false;
        }
        let pos = path.indexOf('/', 1);
        if (pos != -1) {
            let partialPath = path.substring(1, pos);
            if (this.partialPathMap.has(partialPath)) {
                let service = this.partialPathMap.get(partialPath);
                service.onRequest(request, response, path.substring(pos + 1), partialPath);
                return false;
            }
        }
        return true;
    }
    getPriority() {
        return 102;
    }
    register(serviceType) {
        if (this.serviceMap.has(serviceType)) {
            return this.serviceMap.get(serviceType);
        }
        else {
            let service = new serviceType();
            let containerType = service.getContainerType();
            if (containerType) {
                let container = this.register(containerType);
                service.setContainer(container);
            }
            else {
                service.setContainer(this);
            }
            service.prepare(this.application);
            this.serviceMap.set(serviceType, service);
            return service;
        }
    }
    /**
     * This method will return the Service object.
     * @param serviceType The static identifier of the service
     * @returns The service if loaded othervise null.
     */
    get(serviceType) {
        return this.serviceMap.get(serviceType);
    }
    has(serviceType) {
        return this.serviceMap.has(serviceType);
    }
}
//# sourceMappingURL=ServiceManager.js.map
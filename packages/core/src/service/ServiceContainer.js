import { Service } from "../index.js";
/**
 * A service contaner can hold multiple services, and runs the shared code.s
 */
export default class ServiceContainer extends Service {
    fullPathMap = new Map();
    partialPathMap = new Map();
    onRequest(request, response, path, partialPath) {
        if (path && this.fullPathMap.has(path)) {
            let service = this.fullPathMap.get(path);
            service.onRequest(request, response, path, path);
            return;
        }
        let pos = path.indexOf('/', 1);
        if (pos != -1) {
            let partialPath = path.substring(1, pos);
            if (this.partialPathMap.has(partialPath)) {
                let service = this.partialPathMap.get(partialPath);
                service.onRequest(request, response, path.substring(pos + 1), partialPath);
            }
        }
    }
    add(service) {
    }
    getFullPaths() {
        return this.fullPathMap.keys();
    }
    getPartialPaths() {
        return this.partialPathMap.keys();
    }
    listenOnPartialPath(path, target = null) {
        if (target || !this.container) {
            this.partialPathMap.set(path, target);
        }
        else {
            this.container.listenOnPartialPath(path, this);
        }
    }
    listenOnFullPath(path, useRoot = false, target = null) {
        if ((useRoot || !target) && this.container) {
            //If container has parent, send the listener to the root ServiceManager
            this.container.listenOnFullPath(path, useRoot, target || this);
        }
        else {
            this.fullPathMap.set(path, target);
        }
    }
}
//# sourceMappingURL=ServiceContainer.js.map
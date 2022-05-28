import { DefaultServiceContainer } from "../index.js";
export default class Service {
    container;
    /**
     * Do preparation logic here.
     * This function is called, after the Service is mounted.
     * The containers is avaialble at this moment.
     */
    prepare(application) {
    }
    /**
     * Override this method if the service should do something if a request is received.
     * @param request Received request.
     * @param response Response to write.
     */
    onRequest(request, response, path, partialPath) { }
    /**
     * Listen on a full path (without the query part) of the incoming requests.
     * The {@link onRequest} method will triggered if no listener specified.
     * @param path Full path without the leading '/'.
     * @param useRoot Not includes the container's partial path.
     * @param listener This function will be called on request. Default `null`.
     */
    listenOnFullPath(path, useRoot = false) {
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
    listenOnPartialPath(path) {
        this.container.listenOnPartialPath(path, this);
    }
    /**
     * @returns The parent container.
     */
    getContainer() {
        return this.container;
    }
    setContainer(container) {
        this.container = container;
    }
    getContainerType() {
        return DefaultServiceContainer;
    }
}
//# sourceMappingURL=Service.js.map
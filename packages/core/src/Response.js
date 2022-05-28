/**
 * Response
 */
export default class Response {
    controller;
    template = 'Main';
    data = {};
    /**
     * Creates a new response for the given controller
     * @param controller
     */
    constructor(controller) {
        this.controller = controller;
    }
    /**
     * Gets the name of the template
     * @returns
     */
    getTemplateName() {
        return this.template;
    }
    /**
     * Sets the name of the template
     * @param template
     */
    setTemplateName(template) {
        this.template = template;
    }
    getData() {
        return this.data;
    }
    getController() {
        return this.controller;
    }
    getLocale() {
        return null;
    }
    getStream() {
        return null;
    }
    setMime(mime) {
    }
    setBlockPath(path) {
    }
    setData(data) {
        this.data = data;
    }
}
//# sourceMappingURL=Response.js.map
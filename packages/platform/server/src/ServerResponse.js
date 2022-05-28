import { Response } from "@fortles/core";
export default class ServerResponse extends Response {
    httpResponse;
    /**
     * @param {http.ServerResponse} response
     */
    constructor(controller, response) {
        super(controller);
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        this.httpResponse = response;
    }
    write(content) {
        this.httpResponse.write(content);
    }
    close() {
        this.httpResponse.end();
    }
    getStream() {
        return this.httpResponse;
    }
    getOriginal() {
        return this.httpResponse;
    }
    setMime(mime) {
        this.httpResponse.setHeader('Content-Type', mime);
    }
}
//# sourceMappingURL=ServerResponse.js.map
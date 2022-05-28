import { Controller, Response } from "@fortles/core";
export default class TestResponse extends Response {
    body = '';
    target = null;
    blockPath = null;
    constructor(controller = new Controller()) {
        super(controller);
    }
    write(content) {
        this.body += content;
    }
    close() {
    }
    toString() {
        return this.body;
    }
    getBody() {
        return this.body;
    }
    setBlockPath(path) {
        this.blockPath = path;
    }
}
//# sourceMappingURL=TestResponse.js.map
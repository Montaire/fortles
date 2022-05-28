export default class Request {
}
export class DummyRequest extends Request {
    path;
    constructor(path) {
        super();
        this.path = path;
    }
    getType() {
        return null;
    }
    getMime() {
        return null;
    }
    getPath() {
        return this.path;
    }
    getLocale() {
        return null;
    }
    getReferer() {
        return null;
    }
    getBlockPath() {
        throw new Error("Method not implemented.");
    }
    clone() {
        return this;
    }
}
//# sourceMappingURL=Request.js.map
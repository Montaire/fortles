import { Locale, Request } from "@fortles/core";
export default class TestRequest extends Request {
    path;
    type;
    mime;
    referer;
    blockPath;
    constructor(path = "/", type = 0 /* RequestType.FULL */, mime = "text/html") {
        super();
        this.path = path;
        this.type = type;
        this.mime = mime;
    }
    getType() {
        return this.type;
    }
    getMime() {
        return this.mime;
    }
    getPath() {
        return this.path;
    }
    getLocale() {
        return new Locale();
    }
    getReferer() {
        return this.referer;
    }
    getBlockPath() {
        return this.blockPath;
    }
    clone() {
        return this;
    }
}
//# sourceMappingURL=TestRequest.js.map
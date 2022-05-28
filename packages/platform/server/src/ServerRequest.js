import { Request, Locale, Application } from "@fortles/core";
export default class ServerRequest extends Request {
    httpRequest;
    constructor(request) {
        super();
        this.httpRequest = request;
    }
    getType() {
        if (this.httpRequest.method != "GET") {
            return 2 /* RequestType.ACTION */;
        }
        if (this.httpRequest.headers["fortles-source"] !== undefined) {
            return 1 /* RequestType.PARTIAL */;
        }
        if (this.httpRequest.headers["fortles-target"] !== undefined) {
            return 3 /* RequestType.BLOCK */;
        }
        return 0 /* RequestType.FULL */;
    }
    getMime() {
        return this.httpRequest.headers["content-type"] || "text/html";
    }
    getPath() {
        return this.httpRequest.url;
    }
    getLocale() {
        let locale = null;
        const path = this.httpRequest.url;
        if (path.charAt(3) == "/") {
            locale = new Locale(path.substring(0, 2));
        }
        else if (path.charAt(3) == "-" && path.charAt(5) == "/") {
            locale = new Locale(path.substring(0, 2), path.substring(3, 5));
        }
        else {
            //Check the header if the url is not present.
            let header = this.httpRequest.headers["accept-language"];
            let pos = header.indexOf(",");
            header = pos == -1 ? header : header.substring(0, pos);
            let dash = header.indexOf("-");
        }
        return locale;
    }
    getClosestLocale() {
        let header = this.httpRequest.headers["accept-language"];
        let matches = header.matchAll(/([a-z]{2}|\*);q=(0.\d+)/);
        for (const match of matches) {
            let locale = Application.getLocale(match[1]);
            if (locale) {
                return locale;
            }
        }
        return Application.getDefaultLocale();
    }
    getReferer() {
        return this.httpRequest.headers.referer;
    }
    getBlockPath() {
        return this.httpRequest.headers["fortles-source"]
            || this.httpRequest.headers["fortles-target"]
            || "";
    }
    getOriginal() {
        return this.httpRequest;
    }
    clone() {
        return this;
    }
}
//# sourceMappingURL=ServerRequest.js.map
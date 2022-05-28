import { extname } from "path";
export var MimeType;
(function (MimeType) {
    MimeType["JS"] = "text/javascript";
    MimeType["CSS"] = "text/css";
    MimeType["HTML"] = "text/html";
})(MimeType || (MimeType = {}));
export class Mime {
    static detect(path) {
        let extension = extname(path);
        switch (extension) {
            case ".css": return MimeType.CSS;
            case ".js": return MimeType.JS;
            case ".html": return MimeType.HTML;
            default: return null;
        }
    }
}
//# sourceMappingURL=Mime.js.map
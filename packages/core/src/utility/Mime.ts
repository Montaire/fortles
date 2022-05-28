import { extname } from "path";

export enum MimeType{
    JS   = "text/javascript",
    CSS  = "text/css",
    HTML = "text/html"
}

export class Mime{
    public static detect(path: string): MimeType{
        let extension = extname(path);
        switch(extension){
            case ".css": return MimeType.CSS;
            case ".js": return MimeType.JS;
            case ".html": return MimeType.HTML;
            default: return null;
        }
    }
}
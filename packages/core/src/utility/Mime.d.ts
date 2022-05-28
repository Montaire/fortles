export declare enum MimeType {
    JS = "text/javascript",
    CSS = "text/css",
    HTML = "text/html"
}
export declare class Mime {
    static detect(path: string): MimeType;
}

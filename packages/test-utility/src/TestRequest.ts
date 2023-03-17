import { Locale, Request, RequestType } from "@fortles/core";

export default class TestRequest extends Request{
    public path: string;
    public type: RequestType;
    public mime: string;
    public referer?: string;
    public blockPath?: string;

    constructor(path:string = "/", type:RequestType = RequestType.FULL, mime:string = "text/html"){
        super();
        this.path = path;
        this.type = type;
        this.mime = mime;
    }
    public getType(): RequestType {
        return this.type;
    }
    public getMime(): string {
        return this.mime;
    }
    public getPath(): string {
        return this.path;
    }
    public getLocale(): Locale {
        return new Locale();
    }
    public getReferer(): string {
        return this.referer ?? "";
    }
    public getBlockPath(): string {
        return this.blockPath ?? "";
    }
    public clone(): this{
        return this;
    }
}
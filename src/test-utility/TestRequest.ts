import { Request, RequestType } from "@fortles/core";

export default class TestRequest extends Request{
    protected path: string;
    protected type: RequestType;
    protected mime: string;
    constructor(path:string = '/', type:RequestType = RequestType.FULL, mime:string = 'text/html'){
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

}
import * as http from "http";
import {Request, RequestType} from "@fortles/core";

export default class ServerRequest extends Request{

	protected httpRequest: http.IncomingMessage;

    constructor(request: http.IncomingMessage){
        super();
        this.httpRequest = request;
    }

    public getType(): RequestType {
        return RequestType.FULL;
    }

    public getMime(): string {
        return this.httpRequest.headers["content-type"] || "text/html";
    }

    public getPath(): string {
        return this.httpRequest.url;
    }
    
}
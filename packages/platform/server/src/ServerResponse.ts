import * as http from "http";
import * as stream from "stream"
import { Response, Controller } from "@fortles/core";

export default class ServerResponse extends Response{
	public httpResponse: http.ServerResponse;

    /**
     * @param {http.ServerResponse} response 
     */
    constructor(controller: Controller, response: http.ServerResponse){
        super(controller);
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        this.httpResponse = response;
    }

    write(content: any): void{
        this.httpResponse.write(content);
    }

    close(): void{
        this.httpResponse.end();
    }

    public getStream(): stream.Writable{
        return this.httpResponse;
    }

    public getOriginal(): http.ServerResponse{
        return this.httpResponse;
    }

    public setMime(mime: string): void {
        this.httpResponse.setHeader('Content-Type', mime);
    }
}
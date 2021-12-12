import * as http from "http";
import * as stream from "stream"
import { Response, Controller } from "essentials-framework";

export default class ServerResponse extends Response{
	public httpResponse: http.ServerResponse;

    /**
     * @param {http.ServerResponse} response 
     */
    constructor(controller: Controller, response: http.ServerResponse){
        super(controller);
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
}
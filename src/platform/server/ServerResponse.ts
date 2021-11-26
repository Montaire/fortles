import * as http from "http";
import { Response, Controller } from "@core";

export default class ServerResponse extends Response{
	public httpResponse: any;

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

    public getStream(): NodeJS.WritableStream{
        return this.httpResponse;
    }
}
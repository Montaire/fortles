import { Application, Controller } from "essentials/src/index.js";
import * as http from "http";
import Request, { RequestType } from "../core/Request.js";
import Response from "../core/Response.js";
import Platform from "./Platform.js";

export default class ServerPlatform extends Platform{
	public port: number;

    /**
     * Port of the server
     * @param port 
     */
    constructor(port: number){
        super();
        this.port = port;
    }

    run(application: Application){
        const server = http.createServer(
            (request, response) => {
                application.dispatch(new ServerRequest(request), new ServerResponse(application.getMainController(), response));
            }
        );
        server.listen(this.port);

    }
}

class ServerRequest extends Request{

	protected httpRequest: http.IncomingMessage;

    constructor(request: http.IncomingMessage){
        super();
        this.httpRequest = request;
    }

    getType(): RequestType {
        return RequestType.FULL;
    }
    getMime(): string {
        throw "text/html";
    }
    getPath(): string {
        return "/";
    }
}

class ServerResponse extends Response{
	public httpResponse: any;

    /**
     * @param {http.ServerResponse} response 
     */
    constructor(controller: Controller, response: http.ServerResponse){
        super(controller);
        this.httpResponse = response;
    }

    write(content: string): void{
        this.httpResponse.write(content);
    }

    close(): void{
        this.httpResponse.end();
    }
}
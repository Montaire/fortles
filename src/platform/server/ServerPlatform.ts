import { Application} from "@essentials-framework/core";
import { Platform } from "@essentials-framework/core";
import * as http from "http";
import { ServerRequest, ServerResponse } from "./index.js";

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
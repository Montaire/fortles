import { Application, Asset, AssetService, HttpError} from "@fortles/core";
import { Platform } from "@fortles/core";
import * as http from "http";
import * as http2 from "http2";
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
        application.getService(AssetService).add(new Asset("./asset/favicon.ico", "favicon.ico", "image/x-icon", true));
        const server = http.createServer(
            (request, response) => {
                try{
                    application.dispatch(new ServerRequest(request), new ServerResponse(application.getMainController(), response));
                }catch(error){
                    if(error instanceof HttpError){
                        response.statusCode = error.getCode();
                        response.statusMessage = error.getMessage();
                        response.end();
                    }else{
                        throw error;
                    }
                }
            }
        );
        server.listen(this.port);

    }
}
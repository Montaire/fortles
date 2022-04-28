import { Application, Asset, AssetService, HtmlRenderEngine, HttpError} from "@fortles/core";
import { Platform } from "@fortles/core";
import * as http from "http";
import * as http2 from "http2";
import { ServerRequest, ServerResponse } from "./index.js";

export default class ServerPlatform extends Platform{
	public port: number;
    protected templatePaths: string[];
    /**
     * Port of the server
     * @param port 
     */
    constructor(port: number, templatePaths: string[]){
        super();
        this.port = port;
        this.templatePaths = templatePaths;
    }

    prepare(application: Application){
        application.getRenderEngines().set("text/html", new HtmlRenderEngine(application, this.templatePaths));
        application.getService(AssetService).add(new Asset("./asset/favicon.ico", "favicon.ico", "image/x-icon", true));
    }

    run(application: Application){
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
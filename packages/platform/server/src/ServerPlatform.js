import { Asset, AssetService, HtmlRenderEngine, HttpError, Path, ScriptAsset } from "@fortles/core";
import { Platform } from "@fortles/core";
import * as http from "http";
import { ServerRequest, ServerResponse } from "./index.js";
export default class ServerPlatform extends Platform {
    port;
    templatePaths;
    /**
     * Port of the server
     * @param port
     */
    constructor(port, templatePaths) {
        super();
        this.port = port;
        this.templatePaths = templatePaths;
    }
    prepare(application) {
        application.getRenderEngines().set("text/html", new HtmlRenderEngine(application, this.templatePaths));
        application.getService(AssetService)
            .add(new Asset("./asset/favicon.ico", "favicon.ico", "image/x-icon", true))
            .add(new ScriptAsset(Path.resolveMeta("./asset/fortles.js", import.meta)));
    }
    run(application) {
        const server = http.createServer((request, response) => {
            try {
                application.dispatch(new ServerRequest(request), new ServerResponse(application.getMainController(), response));
            }
            catch (error) {
                if (error instanceof HttpError) {
                    response.statusCode = error.getCode();
                    response.statusMessage = error.getMessage();
                    response.end();
                }
                else {
                    throw error;
                }
            }
        });
        server.listen(this.port);
    }
}
//# sourceMappingURL=ServerPlatform.js.map
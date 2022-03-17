import { Addon, Application, Middleware, Request, Response, ScriptAsset } from "@fortles/core";
import { ServerRequest, ServerResponse } from "@fortles/platform.server";
import fs from "fs";
import * as http from "http";
import Path from "path";
import { HtmlRenderEngine } from "../../core/render";

export default class HotReloadAddon implements Addon, Middleware{

    protected clients: http.ServerResponse[] = [];

    public async prepare(application: Application): Promise<void> {
        application.addMiddleware(this);
        this.watch(application);
        let asset = new ScriptAsset(await import.meta.resolve("./asset/event-source.js"));
        application.addAsset(asset);
    }

    public run(request: Request, response: Response): boolean {
        if(request.getPath() == "/fortles/event-source" && response instanceof ServerResponse && request instanceof ServerRequest){
            let originalResponse = response.getOriginal();
            //Create event stream
            originalResponse.writeHead(200, {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive"
            });
            this.clients.push(originalResponse);
            request.getOriginal().on('close', () => {
                this.clients = this.clients.filter(x => x === originalResponse);
            });
            return false;
        }
        return true;
    }

    public watch(application: Application, prefix:string = null){
        let engine = application.getRenderEngines().get("text/html") as HtmlRenderEngine;
        let factory = engine.getTemplateFactory();
        factory.transverse((name, path) => {
            fs.watch(path, (eventType, fileName) => {
                factory.createTemplate(name, path);
                for(const client of this.clients){
                    client.write("event:hot-reload\ndata:reloado\n\n");
                }
            });
        });
    }

    public getPriority(): number {
        return 101;
    }


}
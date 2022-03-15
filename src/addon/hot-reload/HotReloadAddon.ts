import { Addon, Application, Middleware, Request, Response } from "@fortles/core";
import { ServerResponse } from "@fortles/platform.server";
import fs from "fs";
import * as http from "http";
import { HtmlRenderEngine } from "../../core/render";

export class HotReloadAddon implements Addon, Middleware{

    protected clients: http.ServerResponse[] = [];

    public prepare(application: Application): void {
        application.addMiddleware(this);
        this.watch(application);
    }

    public run(request: Request, response: Response): boolean {
        if(request.getPath() == "/dev" && response instanceof ServerResponse){
            let originalResponse = response.getOriginal();
            //Create event stream
            originalResponse.writeHead(200, {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive"
            });
            this.clients.push(originalResponse);
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
                this.clients = this.clients.filter(client => {
                    client.write("reload\n");
                    return !client.writableEnded;
                });
            });
        });
    }

    public getPriority(): number {
        return 101;
    }


}
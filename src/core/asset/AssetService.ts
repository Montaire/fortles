import { Asset } from "./index.js";
import Service from "../service/Service";
import { Request, Response } from "../../index.js";
import { app, ContentAvareRenderEngine, NotFoundError } from "../index.js";
import Path from "path";
import fs from "fs";
import ServiceContainer from "../service/ServiceContainer.js";

export default class AssetService extends Service{

    public prepare(): void {
        this.listenOnPartialPath("asset");
    }

    protected map = new Map<string, Asset>();

    public onRequest(request: Request, response: Response): void {
        let mime: string = null;
        let path = request.getPath();
        if(this.map.has(path)){
            let asset = this.map.get(path);
            path = asset.source;
            mime = asset.mime;
        }else{
            mime = this.resolveMime(Path.extname(path));
        }
        if(path.search("..")){
            throw new NotFoundError("The path is invalid");
        };
        if(mime){
            response.setMime(mime);
        }
        if(response.getStream()){
            let stream = fs.createReadStream("./" + path);
            stream.pipe(response.getStream());
        }else{
            let data = fs.readFileSync("./" + path);
            response.write(data);
        }
    }
    
    public resolveMime(extension: string): string{
        switch(extension){
            case 'css': return 'text/css';
            case 'js' : return 'text/javascript';
            default   : return null;
        }
    }

    /**
     * Add a new asset.
     * @param asset The asset class
     * @param useRoot Use the /asset prefix.
     */
    public add(asset: Asset): this{
        this.map.set(asset.path, asset);
        //subscribe with the custom path
        if(asset.useRoot){
            this.listenOnFullPath(asset.path);
        }
        //add to the corresponding render engines.
        for(const engine of app.getRenderEngines().values()){
            if(engine instanceof ContentAvareRenderEngine){
                engine.addAssetToContent(asset);
            }
        }
        return this;
    }
    public createContainer(): ServiceContainer {
        return null;
    }
}1
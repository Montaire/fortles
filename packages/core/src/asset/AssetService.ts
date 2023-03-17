import { app, ContentAvareRenderEngine, NotFoundError,  Request, Response, ServiceContainer, Service, Asset, Application } from "../index.js";
import Path from "path";
import fs from "fs";
import DefaultServiceContainer from "../service/DefaultServiceContainer.js";
import internal from "stream";

export default class AssetService extends Service implements Iterable<Asset>{

    protected map = new Map<string, Asset>();
    protected application?: Application;

    public override prepare(applcation: Application): void {
        this.application = applcation;
        this.listenOnPartialPath("asset");
    }

    public override onRequest(request: Request, response: Response): void {
        let mime: string|null = null;
        let path = request.getPath();
        if(!path){
            throw new NotFoundError("The path is invalid");
        }
        if(this.map.has(path)){
            let asset = this.map.get(path) as Asset;
            path = asset.source;
            mime = asset.mime;
        }else{
            path = "." + path;
            mime = this.resolveMime(Path.extname(path));
        }
        if(path.search("..")){
            throw new NotFoundError("The path is invalid");
        };
        if(!fs.existsSync(path)){
            throw new NotFoundError("File not found");
        }
        if(mime){
            response.setMime(mime);
        }
        if(response.getStream()){ 
            let stream = fs.createReadStream(path);
            stream.pipe(response.getStream() as internal.Writable);
        }else{
            let data = fs.readFileSync(path);
            response.write(data);
        }
    }
    
    public resolveMime(extension: string): string|null{
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
            this.listenOnFullPath(asset.path, asset.useRoot);
        }
        //add to the corresponding render engines.
        if(this.application){
            for(const engine of this.application.getRenderEngines().values()){
                if(engine instanceof ContentAvareRenderEngine){
                    engine.addAssetToContent(asset);
                }
            }
        }
        return this;
    }

    
    
    public override getContainerType(): (new() => ServiceContainer<any>) | null {
        return null;
    }

    [Symbol.iterator](): Iterator<Asset> {
        return this.map.values();
    }
}
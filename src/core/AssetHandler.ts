import { Middleware, NotFoundError, Request, Response } from "./index.js";
import * as fs from "fs";
import Path from "path";

export default class AssetHandler implements Middleware{

    protected basePath: string = "/asset";
    protected map = new Map<string, Asset>();

    constructor(){
        this.map.set("/favico.ico", new Asset(this.basePath + "/favico.ico", "image/x-icon"));
    }
    
    public run(request: Request, response: Response): boolean {
        let path = request.getPath();
        let mime: string = null;
        if(this.map.has(path)){
            let asset = this.map.get(path);
            path = asset.path;
            mime = asset.mime;
        }else if(!path.startsWith(this.basePath)){
            //If not an asset run foreward
            return true;
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

        return false;
    }

    public resolveMime(extension: string){
        switch(extension){
            case 'css':{
                return 'text/css';
            }
        }
    }

    public getPriority(): number {
        return 100;
    }

    public add(url: string, path:string, mime: string){
        this.map.set(url, new Asset(path, mime));
    }
}

class Asset{
    path: string;
    mime: string;
    constructor(path: string = null, mime: string = null){
        this.path = path;
        this.mime = mime;
    }
}
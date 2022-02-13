import { Middleware, NotFoundError, Request, Response } from "@fortles/core";
import { ServerResponse } from "@fortles/platform.server";
import * as fs from "fs";

export default class AssetMiddleware extends Middleware{
    protected basePath: string = "asset";
    protected map: Map<string, string> = new Map<string, string>();

    constructor(){
        super();
        this.map.set("/favico.ico", "/asset/favico.ico");
    }
    
    public run(request: Request, response: Response): boolean {
        let path = request.getPath();
        if(this.map.get(path)){
            path = this.map.get(path);
        }else if(!path.startsWith(this.basePath)){
            //If not an asset run foreward
            return true;
        }
        if(path.search("..")){
            throw new NotFoundError("The path is invalid");
        };
        if(response.getStream()){
            let stream = fs.createReadStream("./" + this.basePath + path);
            stream.pipe(response.getStream());
        }else{
            let data = fs.readFileSync("./" + this.basePath + path);
            response.write(data);
        }

        return false;
    }
}
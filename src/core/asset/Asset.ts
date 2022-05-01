import { RenderEngineContentPlace } from "../index.js";
import Path from "path";
import * as url from "url";

export class Asset{
    source: string;
    path: string;
    mime: string;
    useRoot: boolean;
    /**
     * 
     * @param source Path to the asset on the server.
     * @param path Path where the client can access the file.
     * @param mime Mime of the file.
     */
    constructor(source: string, path:string = null, mime: string = null, useRoot = false){
        if(source.startsWith("file:")){
            source = url.fileURLToPath(source);
        }
        this.source = source;
        this.path = (useRoot ? "/" : "/asset/") + path;
        this.mime = mime;
        this.useRoot = useRoot;
    }
}

export class SourceAsset extends Asset{
    hasMap: boolean;
    place: RenderEngineContentPlace;
}

export class ScriptAsset extends SourceAsset{
    constructor(source:string, path:string = null, hasMap = true, place = RenderEngineContentPlace.AFTER_CONTENT){
        source = Path.normalize(source);
        if(!path){
            path = "script/" + Path.basename(source);
        }
        super(source, path, "text/javascript");
        this.hasMap = hasMap;
        this.place = place;
    }
}

export class StyleAsset extends SourceAsset{
    constructor(source:string, path:string = null, hasMap = true, place = RenderEngineContentPlace.HEADER){
        if(!path){
            path = "style/" + Path.basename(source);
        }
        super(source, path, "text/css");
        this.hasMap = hasMap;
        this.place = place;
    }
}
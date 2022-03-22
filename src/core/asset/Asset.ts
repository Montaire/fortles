import { RenderEngineContentPlace } from "../index.js";
import Path from "path";

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
        this.source = source;
        this.path = (useRoot ? "/" : "/asset/") + path;
        this.mime = mime;
    }
}

export class SourceAsset extends Asset{
    hasMap: boolean;
    place: RenderEngineContentPlace;
}

export class ScriptAsset extends SourceAsset{
    constructor(source:string, path:string = null, place = RenderEngineContentPlace.AFTER_CONTENT, hasMap = true){
        if(!path){
            path = "script/" + Path.basename(source);
        }
        super(source, path, "text/javascript");
        this.hasMap = hasMap;
        this.place = place;
    }
}

export class StyleAsset extends SourceAsset{
    constructor(source:string, path:string = null, place = RenderEngineContentPlace.HEADER, hasMap = true){
        if(!path){
            path = "style/" + Path.basename(source);
        }
        super(source, path, "text/css");
        this.hasMap = hasMap;
        this.place = place;
    }
}
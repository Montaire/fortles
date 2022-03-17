import { RenderEngineContentPlace } from "../render/RenderEngine";
import Path from "path";

export class Asset{
    source: string;
    url: string;
    mime: string;
    /**
     * 
     * @param source Path to the asset on the server.
     * @param url Url where the client can access the file.
     * @param mime Mime of the file.
     */
    constructor(source: string, url:string = null, mime: string = null){
        this.source = source;
        this.url = "/" + url;
        this.mime = mime;
    }
}

export class SourceAsset extends Asset{
    hasMap: boolean;
    place: RenderEngineContentPlace;
}

export class ScriptAsset extends SourceAsset{
    constructor(source:string, url:string = null, place = RenderEngineContentPlace.AFTER_CONTENT, hasMap = true){
        if(!url){
            url = "asset/script/" + Path.basename(source);
        }
        super(source, url, "text/javascript");
        this.hasMap = hasMap;
        this.place = place;
    }
}

export class StyleAsset extends SourceAsset{
    constructor(source:string, url:string = null, place = RenderEngineContentPlace.HEADER, hasMap = true){
        if(!url){
            url = "asset/style/" + Path.basename(source);
        }
        super(source, url, "text/css");
        this.hasMap = hasMap;
        this.place = place;
    }
}
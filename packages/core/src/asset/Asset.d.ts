import { RenderEngineContentPlace } from "../index.js";
export declare class Asset {
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
    constructor(source: string, path?: string, mime?: string, useRoot?: boolean);
}
export declare class SourceAsset extends Asset {
    hasMap: boolean;
    place: RenderEngineContentPlace;
}
export declare class ScriptAsset extends SourceAsset {
    constructor(source: string, path?: string, hasMap?: boolean, place?: RenderEngineContentPlace);
}
export declare class StyleAsset extends SourceAsset {
    constructor(source: string, path?: string, hasMap?: boolean, place?: RenderEngineContentPlace);
}

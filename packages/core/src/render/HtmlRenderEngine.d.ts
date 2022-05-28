import { Asset } from "../asset/Asset.js";
import { Application, Request, Response } from "../index.js";
import { RenderEngineContentPlace as ContentPlace, TemplateRenderEngine } from "./RenderEngine.js";
export default class HtmlRenderEngine extends TemplateRenderEngine {
    header: string;
    afterConetent: string;
    beforeContent: string;
    constructor(application: Application, templatePaths: string[]);
    dispatch(request: Request, response: Response): void;
    beforeRender(request: Request, response: Response): void;
    afterRender(request: Request, response: Response): void;
    addAssetToContent(asset: Asset): void;
    addContent(content: string, place: ContentPlace): void;
}

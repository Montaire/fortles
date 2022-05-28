import { Asset, Request, Response, Template, TemplateFactory } from "../index.js";
export declare abstract class RenderEngine {
    /**
     * Renders the whole tree from the given controller.
     * @param request
     * @param response
     */
    abstract dispatch(request: Request, response: Response): void;
    /**
     * Fired before the response
     * @param request
     * @param response
     */
    beforeRender(request: Request, response: Response): void;
    /**
     *
     * @param request
     * @param response
     */
    afterRender(request: Request, response: Response): void;
}
export declare enum RenderEngineContentPlace {
    HEADER = 0,
    BFEORE_CONTENT = 1,
    AFTER_CONTENT = 2
}
export declare abstract class ContentAvareRenderEngine extends RenderEngine {
    abstract addAssetToContent(asset: Asset): void;
}
export declare abstract class TemplateRenderEngine extends ContentAvareRenderEngine {
    protected templates: TemplateFactory;
    getTemplate(name: string): Template;
    getTemplateFactory(): TemplateFactory;
}

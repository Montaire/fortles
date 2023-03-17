import { Asset, Request, Response, Template, TemplateFactory } from "../index.js";

export abstract class RenderEngine{

    /**
     * Renders the whole tree from the given controller.
     * @param request 
     * @param response 
     */
    public abstract dispatch(request: Request, response: Response): void;

    /**
     * Fired before the response
     * @param request 
     * @param response 
     */
    public beforeRender(request: Request, response: Response){}

    /**
     * 
     * @param request 
     * @param response 
     */
    public afterRender(request: Request, response: Response){} 
}

export enum RenderEngineContentPlace{
    HEADER,
    BFEORE_CONTENT,
    AFTER_CONTENT
}

export abstract class ContentAvareRenderEngine extends RenderEngine{
    public abstract addAssetToContent(asset: Asset): void;
}

export abstract class TemplateRenderEngine extends ContentAvareRenderEngine{

    protected templates = new TemplateFactory();

    public getTemplate(name: string): Template|null{
        return this.templates.get(name);
    }

    public getTemplateFactory(): TemplateFactory{
        return this.templates;
    }
}
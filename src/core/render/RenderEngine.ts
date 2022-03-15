import { Application, Request, Response } from "../";
import { Template, TemplateFactory } from "../template/index.js";

export default abstract class RenderEngine{

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
    public beforeDispatch(request: Request, response: Response){}

    /**
     * 
     * @param request 
     * @param response 
     */
    public afterDispatch(request: Request, response: Response){} 
}

export abstract class TemplateRenderEngine extends RenderEngine{

    protected templates = new TemplateFactory();

    public getTemplate(name: string): Template{
        return this.templates.get(name);
    }
}
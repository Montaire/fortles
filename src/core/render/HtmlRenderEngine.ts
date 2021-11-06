import RenderEngine from "./RenderEngine.js";
import TemplateFactory from "../template/TemplateFactory.js";
import { Application, Request, Response } from "../index.js";

export default class HtmlRenderEngine extends RenderEngine{
	public templates: TemplateFactory;

    constructor(application: Application){
        super(application);
        this.templates = new TemplateFactory(application);
        this.templates.build('./template');
    }

    dispatch(request: Request, response: Response){
        let template = this.templates.get(response.getTemplateName());
        if(!template){
            throw new Error('Template can not be found "' + response.getTemplateName()+ '"');
        }
        template.render(this, request, response);
    }
    
    beforeDispatch(request: Request, response: Response){
        response.write('<html><header><title>Hello Essential</title></header>');
    }

    afterDispatch(request: Request, response: Response){
        response.write('</html>');
    }
}
import RenderEngine from "./RenderEngine.js";
import TemplateFactory from "../template/TemplateFactory.js";
import { Application, NotFoundError, Request, Response, HttpError } from "../index.js";

export default class HtmlRenderEngine extends RenderEngine{
	public templates: TemplateFactory;

    constructor(application: Application){
        super(application);
        this.templates = new TemplateFactory(application);
        this.templates.build("./template");
    }

    dispatch(request: Request, response: Response){
        try{
            let route = response.getController().getRouter().getRoute(request);
            if(!route){
                throw new NotFoundError("Route not found");
            }
            let template = this.templates.get(route.getTemplate());
            if(!template){
                throw new Error('Template can not be found "' + response.getTemplateName()+ '"');
            }
            template.render(this, request, response);
        }catch(error){
            if(error instanceof HttpError){
                let template = this.templates.get('error');
                if(template){
                    template.render(this, request, response);
                }else{
                    response.write(error.getCode() + ': ' + error.getMessage());
                }
            }
        }
    }
    
    beforeDispatch(request: Request, response: Response){
        response.write('<html><header><title>Hello Essential</title></header>');
    }

    afterDispatch(request: Request, response: Response){
        response.write('</html>');
    }
}
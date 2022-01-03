import RenderEngine from "./RenderEngine.js";
import TemplateFactory from "../template/TemplateFactory.js";
import { Application, NotFoundError, Request, Response, HttpError } from "../index.js";
import * as path from "path";
import * as fs from "fs";
import { RuntimeError } from "../Error.js";

export default class HtmlRenderEngine extends RenderEngine{
	public templates: TemplateFactory;

    constructor(application: Application){
        super(application);
        this.templates = new TemplateFactory(application);
        let templatePath = path.normalize(path.dirname(process.argv[1]) + '/../template');
        if(!fs.existsSync(templatePath)){
            throw new RuntimeError("There is no folder with templates on the'"+templatePath+"'");
        }
        this.templates.build(templatePath);
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
            }else{
                throw error;
            }
        }
    }
    
    beforeDispatch(request: Request, response: Response){
        response.write('<!DOCTYPE html><html><header><title>Hello Essential</title></header>');
    }

    afterDispatch(request: Request, response: Response){
        response.write('</html>');
    }
}
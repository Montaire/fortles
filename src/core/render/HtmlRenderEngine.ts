import * as fs from "fs";
import * as path from "path";
import { RuntimeError } from "../Error.js";
import { Application, HttpError, NotFoundError, Request, Response } from "../index.js";
import TemplateFactory from "../template/TemplateFactory.js";
import RenderEngine, { TemplateRenderEngine } from "./RenderEngine.js";

export default class HtmlRenderEngine extends TemplateRenderEngine{

    constructor(){
        super();
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
        response.write("<!DOCTYPE html><html><header>");
        let header = this.templates.get("header");
        if(header){
            header.render(this, request, response);
        }
        response.write("</header>");
    }

    afterDispatch(request: Request, response: Response){
        response.write('</html>');
    }
}
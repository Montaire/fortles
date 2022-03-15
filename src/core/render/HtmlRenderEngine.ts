import * as fs from "fs";
import * as path from "path";
import { RuntimeError } from "../Error.js";
import { Application, HttpError, NotFoundError, Request, Response } from "../index.js";
import TemplateFactory from "../template/TemplateFactory.js";
import RenderEngine, { TemplateRenderEngine } from "./RenderEngine.js";

export enum HtmlRenderEngineContentPlace{
    HEADER,
    BFEORE_CONTENT,
    AFTER_CONTENT
}

export default class HtmlRenderEngine extends TemplateRenderEngine{

    header: string = null;
    afterConetent: string = null;
    beforeContent: string = null;

    constructor(){
        super();
        let templatePath = path.normalize(path.dirname(process.argv[1]) + '/../template');
        if(!fs.existsSync(templatePath)){
            throw new RuntimeError("There is no folder with templates on the'"+templatePath+"'");
        }
        this.templates.build(templatePath);
    }

    public dispatch(request: Request, response: Response){
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
    
    public beforeDispatch(request: Request, response: Response){
        response.write("<!DOCTYPE html><html><header>");
        let headerTemplate = this.templates.get("header");
        if(headerTemplate){
            headerTemplate.render(this, request, response);
        }
        if(this.header){
            response.write(this.header);
        }
        response.write("</header><body>");
        if(this.beforeContent){
            response.write(this.beforeContent);
        }

    }

    public afterDispatch(request: Request, response: Response){
        if(this.afterConetent){
            response.write(this.afterConetent);
        }
        response.write('</body></html>');
    }

    public addScriptFile(path: string, place: HtmlRenderEngineContentPlace): void{
        this.addContent('<script src="'+path+'" ></script>', place);
    }

    public addContent(content: string, place: HtmlRenderEngineContentPlace): void{
        switch (place){
            case HtmlRenderEngineContentPlace.HEADER:
                this.header += content;
                break;
            case HtmlRenderEngineContentPlace.BFEORE_CONTENT:
                this.beforeContent += content;
                break;
            case HtmlRenderEngineContentPlace.AFTER_CONTENT:
                this.afterConetent += content;
                break;
        }
    }
}
import RenderEngine from "./RenderEngine.js";
import TemplateFactory from "../template/TemplateFactory.js";

export default class HtmlRenderEngine extends RenderEngine{

    constructor(application){
        super(application);
        this.templates = new TemplateFactory(application);
        this.templates.build('/view');
    }

    dispatch(controller, request, response){
        let template = this.templates.get(response.getTemplateName());
        if(!template){
            throw new Error('Template can not be found "' + response.getTemplateName()+ '"');
        }
        template.render(this, response);
    }
    
    beforeDispatch(request, response){
        response.write('<html><header><title>Hello Essential</title></header>');
    }

    afterDispatch(request, response){
        response.write('</html>');
    }
}
const RenderEngine = require("essentials/core/render/RenderEngine");
const TemplateFactory = require("essentials/core/template/TemplateFactory");

class HtmlRenderEngine extends RenderEngine{

    constructor(application){
        super(application);
        this.templates = new TemplateFactory(application);
        this.templates.build('/template');
    }

    dispatch(request, response){
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

module.exports = HtmlRenderEngine;
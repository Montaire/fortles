const Template = require("essentials/core/template/Template");

class TemplateFactory{

    controller(application){
        this.application = application;
    }

    build(rootFolder){
        this.templates = {
            'Main': new Template('./view/Main.html')
        }
    }

    get(name){
        return this.templates[name];
    }
}

module.exports = TemplateFactory;
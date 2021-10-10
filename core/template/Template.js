const TemplateShard = require("essentials/core/template/TemplateShard");

class Template extends TemplateShard{
    construct(path, name, application){
        if(typeof path == String){
            reader = FileSystem.reader(path);
        }
        this.name = name;
        this.application = application;
        prepare(reader);
    }

    getName(){
        return this.name;
    }
}

module.exports = Template;
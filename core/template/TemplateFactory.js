import Template from "./Template.js";
import fs from "fs"

export default class TemplateFactory{

    constructor(application){
        this.application = application;
    }

    build(rootFolder){
        this.templates = {
            "Main": new Template("./view/Main.html")
        }
    }

    get(name){
        return this.templates[name];
    }
}
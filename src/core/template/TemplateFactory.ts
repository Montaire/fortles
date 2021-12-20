import { exit } from "process";
import { Application } from "../index.js";
import { Template } from "./index.js";
import * as fs from "fs";

export default class TemplateFactory{
	public application: Application;
	public templates: Map<string, Template> = new Map();

    constructor(application: Application){
        this.application = application;
    }

    build(rootFolder: string, prefix:string = null){
        let files = fs.readdirSync(rootFolder, {withFileTypes: true});
        for(let file of files){
            let name = prefix ? prefix + '/' + file.name : file.name;
            if(file.isDirectory()){
                this.build(rootFolder + '/' + file.name, name);
            }else{
                name = name.replace(/\.[^/.]+$/, "");
                this.templates.set(name, new Template(rootFolder + "/" + file.name, name));
            }
        }
    }

    get(name: string){
        return this.templates.get(name);
    }
}
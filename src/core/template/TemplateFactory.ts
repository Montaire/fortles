import { exit } from "process";
import { Application } from "../index.js";
import { Template } from "./index.js";
import * as fs from "fs";
import { FileCharacterStreamReader } from "../utility/index.js";

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
                let reader = new FileCharacterStreamReader(rootFolder + "/" + file.name);
                this.templates.set(name, new Template(reader, name));
            }
        }
    }

    get(name: string){
        return this.templates.get(name);
    }
}
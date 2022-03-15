import { exit } from "process";
import { Application } from "../index.js";
import { Template } from "./index.js";
import * as fs from "fs";
import { FileCharacterStreamReader } from "../utility/index.js";

export default class TemplateFactory{
	public templates: Map<string, Template> = new Map();

    public build(rootFolder: string, prefix:string = null){
        let files = fs.readdirSync(rootFolder, {withFileTypes: true});
        for(let file of files){
            let name = prefix ? prefix + '/' + file.name : file.name;
            if(file.isDirectory()){
                this.build(rootFolder + '/' + file.name, name);
            }else{
                name = name.replace(/\.[^/.]+$/, "");
                let reader = new FileCharacterStreamReader(rootFolder + "/" + file.name);
                this.set(name, new Template(reader, name));
            }
        }
    }

    public get(name: string): Template{
        return this.templates.get(name);
    }

    public set(name: string, template: Template): void{
        this.templates.set(name, template);
    }
}
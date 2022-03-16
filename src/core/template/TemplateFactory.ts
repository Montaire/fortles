import { exit } from "process";
import { Application } from "../index.js";
import { Template } from "./index.js";
import * as fs from "fs";
import { FileCharacterStreamReader } from "../utility/index.js";

export default class TemplateFactory{

	protected templates: Map<string, Template> = new Map();

    protected roots: {path: string, prefix:string}[] = [];

    public build(path: string, prefix:string = null){
        this.roots.push({
            path: path,
            prefix: prefix
        });
        this.transverseFolder(path, prefix, this.createTemplate.bind(this));
    }

    public transverse(callback: (name: string, path: string) => void){
        for(const {path, prefix} of this.roots){
            this.transverseFolder(path, prefix, callback);
        }
    }

    public transverseFolder(rootFolder: string, prefix:string = null, callback: (name: string, path: string) => void){
        let files = fs.readdirSync(rootFolder, {withFileTypes: true});
        for(let file of files){
            let name = prefix ? prefix + '/' + file.name : file.name;
            if(file.isDirectory()){
                this.transverseFolder(rootFolder + '/' + file.name, name, callback);
            }else{
                name = name.replace(/\.[^/.]+$/, "");
                callback(name, rootFolder + "/" + file.name);
            }
        }
    }

    public createTemplate(name:string, path:string){
        let reader = new FileCharacterStreamReader(path);
        this.set(name, new Template(reader, name));
    }

    public get(name: string): Template{
        return this.templates.get(name);
    }

    public set(name: string, template: Template): void{
        this.templates.set(name, template);
    }
}
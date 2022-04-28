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

    public transverse(callback: (path: string, name: string) => void){
        for(const {path, prefix} of this.roots){
            this.transverseFolder(path, prefix, callback);
        }
    }

    public transverseFolder(rootFolder: string, prefix:string = null, callback: (path: string, name: string) => void){
        let files = fs.readdirSync(rootFolder, {withFileTypes: true});
        for(let file of files){
            let name = prefix ? prefix + '/' + file.name : file.name;
            if(file.isDirectory()){
                this.transverseFolder(rootFolder + '/' + file.name, name, callback);
            }else{
                //Remove Extension
                name = name.replace(/\.[^/.]+$/, "");
                callback(rootFolder + "/" + file.name, name);
            }
        }
    }

    public createTemplate(path:string, name:string = null){
        let reader = new FileCharacterStreamReader(path);
        if(!name){
            name = path.match(/.+?template[\//](.+)\.[^/.]+$/)[1];
        }
        this.set(new Template(reader, name));
    }

    public get(name: string): Template{
        return this.templates.get(name);
    }

    public set(template: Template): void{
        this.templates.set(template.getName(), template);
    }
}
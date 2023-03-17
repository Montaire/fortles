import { Template, FileCharacterStreamReader, RuntimeError } from "../index.js";

import * as fs from "fs";

export default class TemplateFactory{

	protected templates: Map<string, Template> = new Map();

    protected roots: {path: string, prefix:string|null}[] = [];

    public build(path: string, prefix:string|null = null){
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

    public transverseFolder(rootFolder: string, prefix: string|null = null, callback: (path: string, name: string) => void){
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

    public createTemplate(path:string, name:string|null = null){
        let reader = new FileCharacterStreamReader(path);
        if(!name){
            let result = path.match(/.+?template[\\\/](.+)\.[^/.]+$/);
            if(!result || !result[1]){
                throw new RuntimeError("Cant extract template name from '" + path + "'");
            }
            name = result[1];
        }
        this.set(new Template(reader, name));
    }

    public get(name: string): Template|null{
        return this.templates.get(name) ?? null;
    }

    public set(template: Template): void{
        if(!template.getName()){
            throw new Error("Template has no name.");
        }
        this.templates.set(template.getName() as string, template);
    }
}
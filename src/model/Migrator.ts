import { Entity } from "./index.js";
import * as fs from "fs";
import { extname, resolve } from "path";
import { pathToFileURL } from "url";

export type MigratorConfig = {
}

export class Migrator {

    public async run(paths: string[], config: any){
        console.log(process.cwd() + '/src/model');
        //Collect
        const entities = await this.collect(paths);
        //Create dependency graphx

        //Check changes

        //Create
        this.create(entities);
        //Modify

        //Delete
    }

    protected create(entityType: typeof Entity[]){
        
    }

    protected async collect(rootFolders: string[]): Promise<typeof Entity[]>{
        let result: typeof Entity[] = [];
        for(const rootFolder of rootFolders){
            let files = fs.readdirSync(rootFolder, {withFileTypes: true});
            for(const file of files){
                if(file.isDirectory()){
                    result.concat(await this.collect([file.name]));
                }else if(extname(file.name) == ".js"){
                    let url = pathToFileURL(resolve(rootFolder,file.name));
                    result.push(await import(url.toString()));
                }
            }
        }
        return result;
    }
}
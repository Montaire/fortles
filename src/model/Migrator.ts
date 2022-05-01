import { Entity } from "./index.js";
import * as fs from "fs";

export type MigratorConfig = {
    paths: string
}

export class Migrator {

    public async run(config: any){
        //Collect
        const entities = await this.collect(config.paths);
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
                }else{
                    result.push(await import(file.name));
                }
            }
        }
        return result;
    }
}
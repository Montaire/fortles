import { Entity } from "./index.js";
import * as fs from "fs";

class Migration{

    public run(path:string = null){
        //Collect

        //Create dependency graph

        //Check changes

        //Create

        //Modify

        //Delete
    }

    protected create(entityType: typeof Entity[]){
        
    }

    protected async collect(rootFolder: string): Promise<Entity[]>{
        let result: Entity[] = [];
        let files = fs.readdirSync(rootFolder, {withFileTypes: true});
        for(const file of files){
            if(file.isDirectory()){
                result.concat(await this.collect(file.name));
            }else{
                result.push(await import(file.name));
            }
        }
        return result;
    }
}
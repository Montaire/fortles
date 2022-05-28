import { Entity, EntityDescriptor } from "../index.js";
import * as fs from "fs";
import { extname, resolve } from "path";
import { pathToFileURL } from "url";
import DependencyGraph from "./DependencyGraph.js";

export type MigratorConfig = {
}

export class Migrator {

    public async run(paths: string[], config: any){
        //Collect entites from the project and plugin paths
        const entities = await this.collect(paths);
        //Build Descriptors: solve inheritance
        const descriptors = EntityDescriptor.build(entities);
        //Create dependency graph: check for unresolvable constraints
        const dependencyGraph = new DependencyGraph(descriptors);
        //Check for changes

        //Build execution tree
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
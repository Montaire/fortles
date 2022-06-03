import { Entity, ModelDescriptor } from "../index.js";
import * as fs from "fs";
import { extname, resolve } from "path";
import { pathToFileURL } from "url";
import DependencyGraph from "./DependencyGraph.js";

export type MigratorConfig = {
}

export class Migrator {

    public async run(paths: string[], config: any = {}){
        //Collect entites from the project and plugin paths.
        const entities = await this.collect(paths);
        //Build Descriptors: solve inheritance.
        const descriptor = ModelDescriptor.build(entities);
        //Create the dependency graph: check if the current model is valid.
        //const dependencyGraph = new DependencyGraph(descriptors);
        //Get the descriptors from the previos state.
        const oldDescriptors = [];
        //Get changes as executable tasks.

        //Create an execution plan.
        //Execute.
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
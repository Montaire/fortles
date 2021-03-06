import { extname, resolve } from "path";
import { pathToFileURL } from "url";
import { Entity, EntityDescriptor } from "../index.js";
import { readdirSync } from "fs";
import { EntityChange } from "./EntityChange.js";

export default class ModelDescriptor{
    
    protected descriptors: EntityDescriptor[];

    constructor(desriptors: EntityDescriptor[] = []){
        this.descriptors = desriptors;
    }

    public static async create(rootFolders: string[]): Promise<ModelDescriptor>{
        let entityTypes = await this.collectEntityTypes(rootFolders);
        let descriptors = this.buildDescriptors(entityTypes);
        return new this(descriptors);
    }

    /**
     * Builds all the EntityDescriptors from the given entities.
     * It will include the techincal helper tables, and al the extenensions for the tables.
     * @param entityTypes Entity Types to build from.
     * @returns 
     */
     protected static buildDescriptors(entityTypes: typeof Entity[]): EntityDescriptor[]{
        let descriptors: EntityDescriptor[] = [];

        for(const entityType of entityTypes){
            for(const descriptor of descriptors){
                if(entityType instanceof descriptor.baseEntityType){
                    descriptor.append(entityType);
                    break;
                }
            }
            descriptors.push(EntityDescriptor.create(entityType));
        }
        return descriptors;
    }

    protected static async collectEntityTypes(rootFolders: string[]): Promise<typeof Entity[]>{
        let result: typeof Entity[] = [];
        for(const rootFolder of rootFolders){
            let files = readdirSync(rootFolder, {withFileTypes: true});
            for(const file of files){
                if(file.isDirectory()){
                    result.concat(await this.collectEntityTypes([file.name]));
                }else if(extname(file.name) == ".js"){
                    let url = pathToFileURL(resolve(rootFolder,file.name));
                    let module = await import(url.toString());
                    for(const name in module){
                        if(new module[name] instanceof Entity){
                            result.push(module[name]);
                        }
                    }
                }
            }
        }
        return result;
    }

    public getChanges(oldModelDescriptor: ModelDescriptor): EntityChange[]{
        let current = Object.fromEntries(this.descriptors.map(x => [x.getName(), x]));
        let pervious = Object.fromEntries(oldModelDescriptor.descriptors.map(x => [x.getName(), x]));
        let changes: EntityChange[] = [];
        let change: EntityChange;
        for(const key in current){
            if(pervious[key]){
                //Modified
                change = new EntityChange(pervious[key], current[key]);
                delete pervious[key];
            }else{
                //Created
                change = new EntityChange(null, current[key]);
            }
            changes.push(change);
        }
        //Deleted
        for(const key in pervious){
            let change = new EntityChange(pervious[key], null);
            changes.push(change);
        }
        return changes;
    }

    static serialize(modelDescriptor: ModelDescriptor): string{
        return "";
    }

    static deserialize(rawData: string): ModelDescriptor{
        let data = JSON.parse(rawData);
        return new ModelDescriptor();
    }
}
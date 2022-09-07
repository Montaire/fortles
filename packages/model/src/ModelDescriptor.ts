import { extname, resolve } from "path";
import { pathToFileURL } from "url";
import { Entity, EntityDescriptor, ModelChange, Type } from "./index.js";
import { readdirSync } from "fs";

/**
 * Describes how the model looks.
 * It contains all the entities as well.
 */
export default class ModelDescriptor{
    
    protected entityDescriptors: EntityDescriptor[];
    protected sources: string[];

    constructor(descriptors: EntityDescriptor[] = [], sources: string[] = []){
        this.entityDescriptors = descriptors;
        this.sources = sources;
    }

    /**
     * Creates a Model desciptor from the {@link Entity}s found in the goven subfolders.
     * @param rootFolders Search entities in this folders.
     * @returns The new EntityDescriptor
     */
    public static async create(rootFolders: string[]): Promise<ModelDescriptor>{
        const modelDescriptor = new this([], rootFolders);
        for(const rootFolder of rootFolders){
            const entityTypes = await this.collectEntityTypes(rootFolder);
            modelDescriptor.buildDescriptors(entityTypes, rootFolder);
        }
        return modelDescriptor;
    }

    /**
     * Builds all the EntityDescriptors from the given entities.
     * It will include the techincal helper tables, and al the extenensions for the tables.
     * @param entityTypes Entity Types to build from.
     * @param source Source of the entities
     * @returns 
     */
    protected buildDescriptors(entityTypes: typeof Entity[], source: string = null): void{
        for(const entityType of entityTypes){
            for(const descriptor of this.entityDescriptors){
                if(entityType instanceof descriptor.baseEntityType){
                    descriptor.append(entityType, source);
                    break;
                }
            }
            this.entityDescriptors.push(EntityDescriptor.create(entityType, source));
        }
    }

    protected static async collectEntityTypes(rootFolder: string): Promise<typeof Entity[]>{
        let result: typeof Entity[] = [];
        let files = readdirSync(rootFolder, {withFileTypes: true});
        for(const file of files){
            if(file.isDirectory()){
                result.concat(await this.collectEntityTypes(file.name));
            }else if(extname(file.name) == ".js" && file.name != "index.js"){
                let url = pathToFileURL(resolve(rootFolder,file.name));
                let module = await import(url.toString());
                for(const name in module){
                    if(new module[name] instanceof Entity){
                        result.push(module[name]);
                    }
                }
            }
        }
        return result;
    }

    /**
     * Finds what changed in this EntitiyDescriptors from the give oldModelDescriptor
     * @param oldModelDescriptor Detect changes from this Descriptor.
     * @returns Array of the changes
     */
    public getChanges(oldModelDescriptor: ModelDescriptor): ModelChange[]{
        let current = Object.fromEntries(this.entityDescriptors.map(x => [x.getName(), x]));
        let pervious = Object.fromEntries(oldModelDescriptor.entityDescriptors.map(x => [x.getName(), x]));
        let changes: ModelChange[] = [];
        let change: ModelChange;
        for(const key in current){
            if(pervious[key]){
                //Modified
                change = new ModelChange(pervious[key], current[key]);
                delete pervious[key];
            }else{
                //Created
                change = new ModelChange(null, current[key]);
            }
            changes.push(change);
        }
        //Deleted
        for(const key in pervious){
            let change = new ModelChange(pervious[key], null);
            changes.push(change);
        }
        return changes;
    }

    /**
     * Serializes a given model descriptor
     * @param modelDescriptor 
     * @returns 
     */
    static serialize(modelDescriptor: ModelDescriptor): object{
        let result = {
            descriptors: Object.fromEntries(modelDescriptor.entityDescriptors.entries())
        }
        return result;
    }

    static deserialize(rawData: string): ModelDescriptor{
        let data = JSON.parse(rawData);
        return new ModelDescriptor();
    }

    /**
     * Creates a copy from the model descriptor.
     * Descriptor map cloned as well.
     * @returns The new ModelDescriptor.
     */
    public clone(): ModelDescriptor{
        const descriptors = Array.from(this.entityDescriptors.values());
        return new ModelDescriptor(descriptors);
    }

    public getSources(): string[]{
        return this.sources;
    }

    public getEntityDescriptors(): EntityDescriptor[]{
        return this.entityDescriptors;
    }
}
import { dirname, extname, resolve } from "path";
import { pathToFileURL } from "url";
import { Entity, EntityDescriptor, ModelChange, Type } from "./index.js";
import { createReadStream, createWriteStream, mkdirSync, readdirSync } from "fs";
import { Readable, Stream, Writable } from "stream";

/**
 * Describes how the model looks.
 * It contains all the entities as well.
 */
export default class ModelDescriptor{
    
    protected entityDescriptors: EntityDescriptor[];
    protected sources: string[];

    constructor(entityDescriptors: EntityDescriptor[] = [], sources: string[] = []){
        this.entityDescriptors = entityDescriptors;
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
            const entityTypes = await this.collectEntityTypesFromFolder(rootFolder);
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
                if(descriptor.baseEntityType && new entityType instanceof descriptor.baseEntityType){
                    descriptor.append(entityType, source);
                    break;
                }
            }
            this.entityDescriptors.push(EntityDescriptor.create(entityType, source));
        }
    }

    protected static async collectEntityTypesFromFolder(rootFolder: string): Promise<typeof Entity[]>{
        let result: typeof Entity[] = [];
        const files = readdirSync(rootFolder, {withFileTypes: true});
        for(const file of files){
            if(file.isDirectory()){
                result = result.concat(await this.collectEntityTypesFromFolder(file.name));
            }else if(extname(file.name) == ".js" && file.name != "index.js"){
                result = result.concat(await this.collectEntityTypesFromFile(resolve(rootFolder,file.name)));
            }
        }
        return result;
    }

    protected static async collectEntityTypesFromFile(path: string): Promise<typeof Entity[]>{
        const result: typeof Entity[] = [];
        const url = pathToFileURL(path);
        const module = await import(url.toString());
        for(const name in module){
            if(new module[name] instanceof Entity){
                result.push(module[name]);
            }
        }
        return result;
    }

    /**
     * Finds what changed in this EntitiyDescriptors from the give oldModelDescriptor
     * @param fromModelDescriptor Detect changes from this Descriptor.
     * @returns Array of the changes
     */
    public getChanges(fromModelDescriptor: ModelDescriptor): ModelChange[]{
        let current = Object.fromEntries(this.entityDescriptors.map(x => [x.getName(), x]));
        let pervious = Object.fromEntries(fromModelDescriptor.entityDescriptors.map(x => [x.getName(), x]));
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

    public static toObject(modelDescriptor: ModelDescriptor): object{
        return {
            entityDescriptors: modelDescriptor.entityDescriptors.map(x => EntityDescriptor.toObject(x)),
            sources: Array.from(modelDescriptor.sources)
        };
    }

    /**
     * Serializes a given model descriptor to JSON
     * @param modelDescriptor 
     * @returns 
     */
    public static serialize(modelDescriptor: ModelDescriptor): string{
        const data = this.toObject(modelDescriptor);
        return JSON.stringify(data);
    }

    protected static createFolder(path: string){
        mkdirSync(dirname(path), {recursive: true});
    }

    public static serialize2(modelDescriptor: ModelDescriptor, path: string): void{
        this.createFolder(path);
        const writeStream = createWriteStream(path);
        for(const entityDescriptor of modelDescriptor.getEntityDescriptors()){
            let sources = new Set(entityDescriptor.sourceMap.values());
            for(const source of sources){
                const readStream = createReadStream(source);
                readStream.pipe(writeStream);
                readStream.destroy();
            }
        }
        writeStream.end();
    }

    public static async deserialize2(path:string): Promise<ModelDescriptor>{
        const entityTypes = await this.collectEntityTypesFromFile(path);
        const modelDescriptor = new this([], [path]);
        modelDescriptor.buildDescriptors(entityTypes);
        return modelDescriptor;
    }

    public static fromObject(data: {[key: string]: any}): ModelDescriptor{
        return new ModelDescriptor(
            data.entityDescriptors.map(x => EntityDescriptor.fromObject(x)), 
            data.sources);
    }

    /**
     * Deserializes a model from the given JSON
     * @param rawData
     * @returns 
     */
    public static deserialize(rawData: string): ModelDescriptor{
        const data = JSON.parse(rawData);
        return this.fromObject(data);
    }

    /**
     * Creates a copy from the model descriptor.
     * Descriptor map cloned as well.
     * @returns The new ModelDescriptor.
     */
    public clone(): ModelDescriptor{
        return structuredClone(this);
    }

    public getSources(): string[]{
        return this.sources;
    }

    public getEntityDescriptors(): EntityDescriptor[]{
        return this.entityDescriptors;
    }
}
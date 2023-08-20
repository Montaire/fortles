import { dirname, extname, resolve } from "path";
import { pathToFileURL } from "url";
import { createReadStream, createWriteStream, mkdirSync, readdirSync } from "fs";

import { ClassSerializer } from "./utlity/ClassSerializer.js";
import { AlterSchemaChange, Connection, CreateSchemaChange, DropSchemaChange, Entity, EntityDescriptor, Model, ModelChange, SchemaChange } from "./index.js";
import { readFile, writeFile } from "fs/promises";

/**
 * Describes how the model looks.
 * It contains all the entities as well.
 */
@ClassSerializer.serializable
export class ModelDescriptor{
    
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

    public async addFolder(rootFolder: string): Promise<void>{
        const entityTypes = await ModelDescriptor.collectEntityTypesFromFolder(rootFolder);
        this.buildDescriptors(entityTypes, rootFolder);
    }

    /**
     * Builds all the EntityDescriptors from the given entities.
     * It will include the techincal helper tables, and al the extenensions for the tables.
     * @param entityTypes Entity Types to build from.
     * @param source Source of the entities
     * @returns 
     */
    public buildDescriptors(entityTypes: typeof Entity[], source: string|null = null): void{
        for(const entityType of entityTypes){
            for(const descriptor of this.entityDescriptors){
                if(descriptor.baseEntityType && new entityType instanceof descriptor.baseEntityType){
                    descriptor.append(entityType, source);
                    break;
                }
            }
            this.entityDescriptors.push(EntityDescriptor.create(entityType, this, source));
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
    public getChanges(fromModelDescriptor: ModelDescriptor): Map<string, SchemaChange[]>{
        let current = Object.fromEntries(this.entityDescriptors.map(x => [x.getName(), x]));
        let pervious = Object.fromEntries(fromModelDescriptor.entityDescriptors.map(x => [x.getName(), x])) as {[key: string]: EntityDescriptor};
        const changes =  new Map<string, SchemaChange[]>();
        for(const key in current){
            const connectionName = current[key].getConnection().getDriver().getName();
            if(!changes.has(connectionName)){
                changes.set(connectionName, []);
            }
            if(pervious[key]){
                //Modified
                const change = AlterSchemaChange.createFromEntityDescriptor(pervious[key], current[key]);
                if(change){
                    changes.get(connectionName)?.push(change);
                    delete pervious[key];
                }
            }else{
                //Created
                const change = CreateSchemaChange.createFromEntityDescriptor(current[key]);
                changes.get(connectionName)?.push(change);
            }
        }
        //Deleted
        for(const key in pervious){
            const connectionName = pervious[key].getConnection().getDriver().getName();
            const change = DropSchemaChange.createFromEntityDescriptor(current[key]);
            if(!changes.has(connectionName)){
                changes.set(connectionName, []);
            }
            changes.get(connectionName)?.push(change);
        }
        return changes;
    }

    public static toObject(modelDescriptor: ModelDescriptor): object{
        return {
            entityDescriptors: modelDescriptor.entityDescriptors.map(x => ClassSerializer.export(x)),
            sources: Array.from(modelDescriptor.sources)
        };
    }

    /**
     * Serializes a given model descriptor to JSON
     * @param modelDescriptor 
     * @returns 
     */
    /*public static serialize(modelDescriptor: ModelDescriptor): string{
        const data = this.toObject(modelDescriptor);
        return JSON.stringify(data);
    }*/

    protected static createFolder(path: string){
        mkdirSync(dirname(path), {recursive: true});
    }

    public static async serialize(modelDescriptor: ModelDescriptor, path: string){
        this.createFolder(path);
        const data = ClassSerializer.serialize(modelDescriptor);
        await writeFile(path, data);
    }

    public static async deserialize(path: string): Promise<ModelDescriptor>{
        const data = await readFile(path);
        return ClassSerializer.deserialize<ModelDescriptor>(data.toString());
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
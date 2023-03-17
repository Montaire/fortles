import { Entity, Type } from "../index.js";
import { ClassSerializer, Exportable, ExportedData, ExportedObject } from "../utlity/ClassSerializer.js";

/**
 * The largest set of the entities, it ucludes all connection, and extensions.
 */
export default class EntityDescriptor implements Exportable{
    baseEntityType: typeof Entity | null;
    baseName: string;
    typeMap: Map<string, Type<any, any>>;
    sourceMap: Map<string, string|null>;

    constructor(name: string, 
        typeMap?: Map<string, Type<any, any>>, 
        sourceMap: Map<string, string|null> = new Map<string, string>(), 
        baseType: typeof Entity | null = null){
        this.baseName = name;
        this.typeMap = new Map(typeMap);
        this.sourceMap = sourceMap;
        this.baseEntityType = baseType;
        ClassSerializer.register(EntityDescriptor);
    }

    public append(entityType: typeof Entity, source: string|null = null){
        //Check if the given entityType is the base class of the current baseEntityType
        let isBase = false;
        if(this.baseEntityType && new this.baseEntityType instanceof entityType){
            isBase = true;
        }

        for(const [name, type] of entityType.getTypeMap()){
            let override = true;
            if(this.typeMap.has(name)){
                if(this.typeMap.get(name) !== type){
                    throw new Error("Field '" + name + "' on '" + entityType.name + "' tries to overwrite '" + this.baseEntityType?.name + "'");
                }
                if(!isBase){
                    override = false;
                }
            }
            //If the property already defined in a base, do not override it.
            if(override){
                this.typeMap.set(name, type);
                if(source){
                    this.sourceMap.set(name, source);
                }
            }
        }
        // Set the baseEntityType later for better error handling.
        if(isBase){
            this.baseEntityType = entityType;
            this.baseName = entityType.name;
        }
        //Register entity to the serializer
        ClassSerializer.register(entityType);
    }

    public getName(): string{
        return this.baseName;
    }

    public static create(entityType: typeof Entity, source: string|null = null){
        const typeMap = entityType.getTypeMap();
        const sourceMap = new Map(Array.from(typeMap, ([name, x]) => [name, source]));
        return new this(entityType.name, entityType.getTypeMap(), sourceMap, entityType);
    }

    public export(): object{
        return {
            baseName: this.baseName,
            typeMap: Array.from(this.typeMap.entries())
                .map(([key, value]) => [key, ClassSerializer.export(value)]),
            sourceMap: Array.from(this.sourceMap.entries()),
        }
    }

    public import(data: ExportedData): void{
        this.baseName = data.baseName, 
        this.typeMap = new Map(data.typeMap.map(([key, value]: [string, ExportedObject]) => [key, ClassSerializer.import(value)])), 
        this.sourceMap = new Map(data.sourceMap);
    }
}
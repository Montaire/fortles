import { Entity, Type } from "../index.js";

/**
 * The largest set of the entities, it ucludes all connection, and extensions.
 */
export default class EntityDescriptor{
    baseEntityType: typeof Entity;
    baseName: string;
    typeMap: Map<string, Type<any, any>>;
    sourceMap: Map<string, string>;

    constructor(name: string = null, typeMap?: Map<string, Type<any, any>>, sourceMap: Map<string, string> = new Map<string, string>(), baseType: typeof Entity = null){
        this.baseName = name;
        this.typeMap = new Map(typeMap);
        this.sourceMap = sourceMap;
        this.baseEntityType = baseType;
    }

    public append(entityType: typeof Entity, source: string = null){
        //Check if the given entityType is the base class of the current baseEntityType
        let isBase = false;
        if(new this.baseEntityType instanceof entityType){
            isBase = true;
        }

        for(const [name, type] of entityType.getTypeMap()){
            let override = true;
            if(this.typeMap.has(name)){
                if(this.typeMap.get(name) !== type){
                    throw new Error("Field '" + name + "' on '" + entityType.name + "' tries to overwrite '" + this.baseEntityType.name + "'");
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
    }

    public getName(): string{
        return this.baseName;
    }

    public static create(entityType: typeof Entity, source: string = null){
        const typeMap = entityType.getTypeMap();
        const sourceMap = new Map(Array.from(typeMap, ([name, x]) => [name, source]));
        return new this(entityType.name, entityType.getTypeMap(), sourceMap, entityType);
    }

    public static toObject(entityDescriptor: EntityDescriptor): object{
        return {
            name: entityDescriptor.baseName,
            typeMap: Array.from(entityDescriptor.typeMap.entries()),
            sourceMap: Array.from(entityDescriptor.sourceMap.entries()),
        }
    }

    public static fromObject(data: {[key: string]: any}): EntityDescriptor{
        return new EntityDescriptor(data.name, new Map(data.typeMap), new Map(data.sourceMap));
    }
}
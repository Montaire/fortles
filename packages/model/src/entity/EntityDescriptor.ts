import { Entity, Type } from "../index.js";

/**
 * The largest set of the entities, it ucludes all connection, and extensions.
 */
export default class EntityDescriptor{
    baseEntityType: typeof Entity;
    name: string;
    typeMap: Map<string, Type<any, any>>;
    sourceMap: Map<string, string>;

    constructor(typeMap?: Map<string, Type<any, any>>, sourceMap: Map<string, string> = new Map<string, string>()){
        this.typeMap = new Map(typeMap);
        this.sourceMap = sourceMap;
    }

    public getName(){
        return this.name;
    }

    public append(entityType: typeof Entity, source: string = null){
        for(const [name, type] of entityType.getTypeMap()){
            if(this.typeMap.has(name)){
                if(this.typeMap.get(name) !== type){
                    throw new Error("Field '" + name + "' on '" + entityType.name + "' tries to overwrite '" + this.baseEntityType.name + "'");
                }
            }else{
                this.typeMap.set(name, type);
            }
            if(source){
                this.sourceMap.set(name, source);
            }
        }
        if(entityType instanceof this.baseEntityType){
            this.baseEntityType = entityType;
        }
    }

    public static create(entityType: typeof Entity, source: string = null){
        const typeMap = entityType.getTypeMap();
        const sourceMap = new Map(Array.from(typeMap, ([name, x]) => [name, source]));
        return new this(entityType.getTypeMap(), sourceMap);
    }
}
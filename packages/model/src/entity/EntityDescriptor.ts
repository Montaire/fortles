import { Entity, Type } from "../index.js";

/**
 * The largest set of the entities, it ucludes all connection, and extensions.
 */
export default class EntityDescriptor{
    baseEntityType: typeof Entity;
    name: string;
    typeMap: Map<string, Type<any, any>>;

    constructor(typeMap?: Map<string, Type<any, any>>){
        this.typeMap = new Map(typeMap);
    }

    public append(entityType: typeof Entity){
        for(const [name, type] of entityType.getTypeMap()){
            if(this.typeMap.has(name)){
                if(this.typeMap.get(name) !== type){
                    throw new Error("Field '" + name + "' on '" + entityType.name + "' tries to overwrite '" + this.baseEntityType.name + "'");
                }
            }else{
                this.typeMap.set(name, type);
            }
        }
        if(entityType instanceof this.baseEntityType){
            this.baseEntityType = entityType;
        }
    }

    public static create(entityType: typeof Entity){
        return new this(entityType.getTypeMap());
    }
}
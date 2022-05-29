import { Entity, Type } from "../index.js";

/**
 * The largest set of the entities, it ucludes all connection, and extensions.
 */
export default class EntityDescriptor{
    baseEntityType: typeof Entity;
    typeMap: Map<string, Type<any, any>>;

    constructor(entityType: typeof Entity){
        this.typeMap = new Map(entityType.getTypeMap());
    }

    append(entityType: typeof Entity){
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

    /**
     * Builds all the EntityDescriptors from the given entities.
     * It will include the techincal helper tables, and al the extenensions for the tables.
     * @param entityTypes Entity Types to build from.
     * @returns 
     */
    static build(entityTypes: typeof Entity[]): EntityDescriptor[]{
        let descriptors: EntityDescriptor[] = [];

        for(const entityType of entityTypes){
            for(const descriptor of descriptors){
                if(entityType instanceof descriptor.baseEntityType){
                    descriptor.append(entityType);
                    break;
                }
            }
            descriptors.push(new EntityDescriptor(entityType))
        }

        return descriptors;
    }
}
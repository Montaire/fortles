import { Entity, EntityDescriptor } from "../index.js";

export default class ModelDescriptor{
    
    protected descriptors: EntityDescriptor[];

    constructor(desriptors: EntityDescriptor[] = []){
        this.descriptors = desriptors;
    }
    /**
     * Builds all the EntityDescriptors from the given entities.
     * It will include the techincal helper tables, and al the extenensions for the tables.
     * @param entityTypes Entity Types to build from.
     * @returns 
     */
     static build(entityTypes: typeof Entity[]): ModelDescriptor{
        let descriptors: EntityDescriptor[] = [];

        for(const entityType of entityTypes){
            for(const descriptor of descriptors){
                if(entityType instanceof descriptor.baseEntityType){
                    descriptor.append(entityType);
                    break;
                }
            }
            descriptors.push(new EntityDescriptor(entityType.getTypeMap()))
        }
        return new ModelDescriptor(descriptors);
    }

    static serialize(modelDescriptor: ModelDescriptor): string{
        return "";
    }

    static deserialize(json: string): ModelDescriptor{
        return new ModelDescriptor();
    }
}
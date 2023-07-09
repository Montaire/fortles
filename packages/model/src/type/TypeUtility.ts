import { Entity, EntityModelInfo, Type, TypeProperty } from "../index.js";

export default class TypeUtility{
    public static setTypeProperty(target: typeof Entity|null, name: string | symbol, propertyKey: string, propertyValue?: Object): void{
        const modelInfo = this.getModelInfo(target);
        if(propertyKey == TypeProperty.PRIMARY_KEY){
            modelInfo.primaryKeys.push(name.toString());
        }
        let type = modelInfo.typeMap.get(name.toString()) as Type<any, any>;
        if(!type){
            throw new Error("'" + (target?.name ?? "Entity") + "' for '" + name.toString() + "' needs a type decorator at the last position.");
        }
        type.setProperty(propertyKey, propertyValue);
    }
    
    public static setType(target: typeof Entity | null, propertyKey: string | symbol, type: Type<any, any> | (() => Type<any, any>)): void{
        const modelInfo = this.getModelInfo(target);
        modelInfo.typeMap.set(propertyKey as string, type instanceof Function ? type() : type);
    }

    protected static getModelInfo(target: typeof Entity | null): EntityModelInfo{
        if(target){
            return target.getModelInfo();
        }
        if(!EntityModelInfo.temporary){
            EntityModelInfo.temporary = new EntityModelInfo();
        }
        return EntityModelInfo.temporary;
    }
}
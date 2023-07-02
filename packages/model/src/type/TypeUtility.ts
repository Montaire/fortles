import { Entity, EntityModelInfo, Type } from "../index.js";

export default class TypeUtility{
    public static setTypeProperty(target: Entity, name: string | symbol, propertyKey: string, propertyValue?: Object): void{
        const modelInfo = (target.constructor as typeof Entity).getModelInfo();
        modelInfo.primaryKeys.push(name.toString());
        let type = modelInfo.typeMap.get(name.toString()) as Type<any, any>;
        if(!type){
            throw new Error("'" + (target?.constructor.name ?? "Entity") + "' for '" + name.toString() + "' needs a type decorator at the last position.");
        }
        type.setProperty(propertyKey, propertyValue);
    }
    
    public static setType(target: Entity | null, propertyKey: string | symbol, type: Type<any, any> | ((target: typeof Entity) => Type<any, any>)): void{
        const targetType = (target?.constructor ?? Entity.lastTarget) as typeof Entity;
        const modelInfo = targetType.getModelInfo();
        modelInfo.typeMap.set(propertyKey as string, type instanceof Function ? type(targetType) : type);
    }
}
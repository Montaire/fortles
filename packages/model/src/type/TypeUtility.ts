import { Entity, Type } from "../index.js";

export default class TypeUtility{
    public static setTypeProperty(target: Entity, name: string, propertyKey: string, propertyValue?: Object): void{
        const modelInfo = (target.constructor as typeof Entity).getModelInfo();
        modelInfo.primaryKeys.push(name);
        let type = modelInfo.typeMap.get(name) as Type<any, any>;
        if(!type){
            throw new Error("'" + target.constructor.name + "' for '" + name + "' needs a type decorator at the last position.");
        }
        type.setProperty(propertyKey, propertyValue);
    }
    
    public static setType(target: Entity, propertyKey: string, type: Type<any, any>): void{
        const modelInfo = (target.constructor as typeof Entity).getModelInfo();
        modelInfo.typeMap.set(propertyKey, type);
    }
}
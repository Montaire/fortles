import { Entity, Type } from "../index.js";

export default class TypeUtility{
    public static setTypeProperty(target: Entity, name: string|Symbol, propertyKey: string, propertyValue?: Object): void{
        target.constructor["primaryKeys"].push(name);
        let type = target.constructor["typeMap"].get(name) as Type<any, any>;
        if(!type){
            throw new Error("'" + target.constructor.name + "' for '" + name + "' needs a type decorator at the last position.");
        }
        type.setProperty(propertyKey, propertyValue);
    }
    
    public static setType(target: Entity, propertyKey: string|Symbol, type: Type<any, any>): void{
        target.constructor["typeMap"].set(propertyKey, type);
    }
}
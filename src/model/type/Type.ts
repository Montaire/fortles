import { Entity } from "../index.js";
import { RuntimeError } from "../../core";

/**
 * - Validation
 * - Conversion (serialization, deserialization, sql->extendable)
 * - Formatting
 */
export default class Type<T>{

}

export function readonly(target: Entity, name: string, descriptor: PropertyDescriptor) {
    descriptor.writable = false;
    return descriptor;
}  

export function primaryKey(target: Entity, name: string): void{
    this.primaryKeys.push(name);
    let typeMap = this.typeMap.get(name);
    if(!typeMap){
        throw new RuntimeError("'" + target.constructor.name + "' for '" + name + "' needs a type decorator before the '@primaryKey' modifier");
    }
    typeMap.setProperty("primaryKey");
}

export function generated(target: Entity, name:string) {
    let typeMap = this.typeMap.get(name);
    if(!typeMap){
        throw new RuntimeError("'" + target.constructor.name + "' for '" + name + "' needs a type decorator before the '@primaryKey' modifier");
    }
    typeMap.setProperty("generated");
}
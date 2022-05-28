import { Entity, Type } from "../index.js";
export default class TypeUtility {
    static setTypeProperty(target: Entity, name: string | Symbol, propertyKey: string, propertyValue?: Object): void;
    static setType(target: Entity, propertyKey: string | Symbol, type: Type<any, any>): void;
}

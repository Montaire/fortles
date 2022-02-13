import { Type, EntityPropertyDecorator, TypeUtility } from "./index.js";
import { Entity } from "../index.js";

type StringTypeConfig = {
    fixed?: boolean,
    length?: number
};

export class StringType extends Type<string, StringTypeConfig>{
    constructor(config: StringTypeConfig = {length: 80}){
        super(config);
    }
}

export function string(config?: StringTypeConfig): EntityPropertyDecorator {
    return function(target: Entity, propertyKey: string | Symbol): void{
        TypeUtility.setType(target, propertyKey, new StringType(config));
    };
}
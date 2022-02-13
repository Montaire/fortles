import { Type } from "./index.js";
import { Entity } from "../index.js";

type IntegerTypeConfig = {
    min?: number,
    max?: number
};

export class IntegerType extends Type<number, IntegerTypeConfig>{
    constructor(config: IntegerTypeConfig = {}){
        super(config);
        if(config.min){
            this.addValidation(x => x >= config.min ? null : "Should not be less than "+config.min);
        }
        if(config.max){
            this.addValidation(x => x <= config.max ? null : "Should not be greater than "+config.min);
        }
    }
}

export function integer(config?: IntegerTypeConfig): PropertyDecorator {
    return function(target: Entity, propertyKey: string | Symbol): void{
        target.constructor["typeMap"].set(propertyKey, new IntegerType(config));
    };
}
import { Type } from "./index.js";

type IntegerConfig = {
    min: number,
    max: number
};

export default class StringType extends Type<number>{
    
}

type StringTypeConfig = {
    length: number,
    fixed: false
}

export function string(config?: StringTypeConfig): PropertyDecorator {
    return function(target: Object, propertyKey: string | Symbol): void{
        this.propertyMap
    };
}
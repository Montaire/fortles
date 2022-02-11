import { Type } from "./index.js";

type IntegerConfig = {
    min: number,
    max: number
};

export default class IntegerType extends Type<number>{
    
}

export function integer(config?: IntegerConfig): PropertyDecorator {
    return function(target: Object, propertyKey: string): void{

    };
}
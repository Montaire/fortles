import { Type, EntityFieldDecorator, TypeUtility } from "./index.js";
import { Entity } from "../index.js";
import ErrorReporter from "../ErrorReporter.js";

export type StringTypeConfig = {
    fixed?: boolean,
    length?: number
};

export class StringType extends Type<string, StringTypeConfig>{

    public parse(input: string, reporter: ErrorReporter): string {
        return input;
    }

    constructor(name: string | symbol, config: StringTypeConfig = {length: 80}){
        super(name, config);
    }
}

export function string(config?: StringTypeConfig): EntityFieldDecorator {
    return function(target: Entity, context: ClassFieldDecoratorContext): void{
        TypeUtility.setType(target, context.name, new StringType(context.name, config));
    };
}
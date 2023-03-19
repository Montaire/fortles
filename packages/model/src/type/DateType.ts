import { Type, EntityFieldDecorator, TypeUtility } from "./index.js";
import { Entity } from "../index.js";
import ErrorReporter from "../ErrorReporter.js";

export enum DateMode{
    Date,
    DateTime
}

export type DateTypeConfig = {
    mode: DateMode
};

export class DateType extends Type<string, DateTypeConfig>{

    public parse(input: string, reporter: ErrorReporter): string {
        return input;
    }

    constructor(name: string | symbol, config: DateTypeConfig = {mode: DateMode.Date}){
        super(name, config);
    }
}

export function date(config?: DateTypeConfig): EntityFieldDecorator {
    return function(value: Entity, context: ClassFieldDecoratorContext): void{
        TypeUtility.setType(null, context.name, new DateType(context.name, config));
    };
}
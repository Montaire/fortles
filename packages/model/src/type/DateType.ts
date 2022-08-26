import { Type, EntityPropertyDecorator, TypeUtility } from "./index.js";
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

    constructor(name: string, config: DateTypeConfig = {mode: DateMode.Date}){
        super(name, config);
    }
}

export function date(config?: DateTypeConfig): EntityPropertyDecorator {
    return function(target: Entity, propertyKey: string): void{
        TypeUtility.setType(target, propertyKey, new DateType(propertyKey, config));
    };
}
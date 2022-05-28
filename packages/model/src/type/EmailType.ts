import { Type, EntityPropertyDecorator, TypeUtility } from "./index.js";
import { Entity } from "../index.js";
import { StringType } from "./StringType.js";
import ErrorReporter from "../ErrorReporter.js";

export type EmailTypeConfig = {
    length?: number,
    checkMx?: false
};

export class EmailType extends StringType{

    public parse(input: string, reporter: ErrorReporter): string {
        return input;
    }
    
    constructor(config: EmailTypeConfig = {length: 80}){
        super({
            length: config.length,
            fixed: false
        });
    }
}

export function email(config?: EmailTypeConfig): EntityPropertyDecorator {
    return function(target: Entity, propertyKey: string | Symbol): void{
        TypeUtility.setType(target, propertyKey, new EmailType(config));
    };
}
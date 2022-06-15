import { Type, EntityPropertyDecorator, TypeUtility } from "./index.js";
import { Entity } from "../index.js";
import { StringType } from "./StringType.js";
import ErrorReporter from "../ErrorReporter.js";

export type EmailTypeConfig = {
    length?: number,
    checkMx?: false
};

export class EmailType extends StringType{

    public override parse(input: string, reporter: ErrorReporter): string {
        return input;
    }
    
    constructor(name: string, config: EmailTypeConfig = {length: 80}){
        super(name, {
            length: config.length,
            fixed: false
        });
    }
}

export function email(config?: EmailTypeConfig): EntityPropertyDecorator {
    return function(target: Entity, propertyKey: string): void{
        TypeUtility.setType(target, propertyKey, new EmailType(propertyKey, config));
    };
}
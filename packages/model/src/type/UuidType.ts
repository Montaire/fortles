import { EntityFieldDecorator, TypeUtility, StringType, Entity } from "../index.js";
import { randomUUID } from "crypto";

export type UuidTypeConfig = {
    generated?: boolean
};

export class UuidType extends StringType{
    constructor(name: string|symbol, config: UuidTypeConfig = {generated: true}){
        super(name, {fixed: true, length:36});
        let regexp = /([0-9a-f]{4}-?){4}/;
        this.addValidation(x => regexp.test(x) ? null : "");
    }

    generate(): string{
        return randomUUID();
    }
}

export function uuid(config?: UuidTypeConfig): EntityFieldDecorator {
    return function(value: Entity, context: ClassFieldDecoratorContext): void{
        TypeUtility.setType(null, context.name, new UuidType(context.name, config));
    };
}
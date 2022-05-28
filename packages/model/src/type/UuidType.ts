import { EntityPropertyDecorator, TypeUtility, StringType, StringTypeConfig } from "./index.js";
import { Entity } from "../index.js";
import { generated } from "./Type.js";
import { randomUUID } from "crypto";

export type UuidTypeConfig = {
    generated?: boolean
};

export class UuidType extends StringType{
    constructor(config: UuidTypeConfig = {generated: true}){
        super({fixed: true, length:36});
        let regexp = /([0-9a-f]{4}-?){4}/;
        this.addValidation(x => regexp.test(x) ? null : "");
    }

    generate(): string{
        return randomUUID();
    }
}

export function uuid(config?: UuidTypeConfig): EntityPropertyDecorator {
    return function(target: Entity, propertyKey: string | Symbol): void{
        TypeUtility.setType(target, propertyKey, new UuidType(config));
    };
}
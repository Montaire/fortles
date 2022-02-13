import { Entity } from "../index.js";
import TypeUtility from "./TypeUtility.js";

export type EntityPropertyDecorator = (target: Entity, propertyKey: string | symbol) => void;

export type Validation<T> = (value: T) => string | null

/**
 * - Validation
 * - Conversion (serialization, deserialization, sql->extendable)
 * - Formatting
 */


export class Type<T,C>{
    protected propertyMap = new Map<string, Object>();

    protected validations: Validation<T>[] = [];

    protected config: C;

    public constructor(config: C){
        this.config = config;
    }

    public setProperty(name: string, value: Object = null): void{
        this.propertyMap.set(name, value);
    }

    public getProperty(name: string): Object{
        return this.propertyMap.get(name);
    }

    public getConfig(): C{
        return this.config;
    }

    public hasProperty(name: string): boolean{
        return this.propertyMap.has(name);
    }

    public addValidation(validation: Validation<T>){
        this.validations.push(validation);
    }

    /**
     * Validates a property with the given rules.
     * @param value Value to valudate
     * @returns Array of the errors
     */
    public validate(value: T): string[]{
        let errors: string[] = [];
        for(let validation of this.validations){
            let result = validation(value);
            if(result != null){
                errors.push(result);
            }
        }
        return errors;
    }
}

export enum TypeProperty{
    PRIMARY_KEY = "primaryKey",
    GENERATED = "generated",
    HAS_ONE = "hasOne",
    HAS_MANY = "hasMany",
    BELONGS_TO = "belongsTo",
    BELONGS_TO_MANY = "belongsToMany"
}

export function readonly(target: Entity, name: string, descriptor: PropertyDescriptor) {
    descriptor.writable = false;
    return descriptor;
}  

export function primaryKey(target: Entity, name: string): void{
    TypeUtility.setTypeProperty(target, name, TypeProperty.PRIMARY_KEY);
}

export function generated(target: Entity, name:string) {
    TypeUtility.setTypeProperty(target, name, TypeProperty.GENERATED);
}
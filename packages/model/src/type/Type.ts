import { Entity, ErrorReporter, TypeUtility } from "../index.js";
import * as types from "../type/index.js"

export type EntityPropertyDecorator = (target: Entity, propertyKey: string | symbol) => void;

/**
 * Callable, that returns null on success, and the error message on fail.
 */
export type Validation<T> = (value: T) => string | null

/**
 * - Validation
 * - Conversion (serialization, deserialization, sql->extendable)
 * - Formatting
 */


export abstract class Type<T,C>{

    protected propertyMap = new Map<string, Object>();

    protected validations: Validation<T>[] = [];

    protected name: string;

    protected config: C;

    public constructor(
        name: string, 
        config: C, propertyMap: Map<string, Object> = new Map<string, Object>(), 
        validations: Validation<T>[] = []
    ){
        this.name = name;
        this.config = config;
        this.propertyMap = propertyMap;
        this.validations = validations;

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

    public getName(){
        return this.name;
    }

    /**
     * Adds a validation
     * @param validation A validation is a callable, that should return null on success, the error message on fail.
     */
    public addValidation(validation: Validation<T>): void{
        this.validations.push(validation);
    }

    /**
     * Parses a value what was given on the user side. Validations wil run on successful parsing.
     * @param input Input to process
     * @param errorReporter Report errors here if the conversion fails. If an error were reported, the parsing fails regardless of the output.
     * @returns The converted value, or null if the input recognised as a null value.
     */
    public abstract parse(input: string, errorReporter: ErrorReporter): T|null;

    /**
     * Validates a property with the given rules.
     * validation happens after parsing to the target type.
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

    public static toObject(type: Type<any, any>): object{
        return{
            type: type.constructor.name,
            name: type.name,
            config: type.config,
            propertyMap: Array.from(type.propertyMap.entries()),
            validations: type.validations
        };
    }

    public static fromObject(data: {[key:string]: any}): Type<any, any>{
        let typeConstructor = types[data.type];
        if(!typeConstructor){
            throw new Error("Unknow type '" + data.type + "'. TODO: Use types from other places as well!");
        }
        return new typeConstructor(
            data.name,
            data.config,
            new Map(data.propertyMap),
            data.validations
        );
    }
}

export enum TypeProperty{
    PRIMARY_KEY = "primaryKey",
    GENERATED = "generated",
    HAS_ONE = "hasOne",
    HAS_MANY = "hasMany",
    BELONGS_TO = "belongsTo",
    BELONGS_TO_MANY = "belongsToMany",
    NULLABLE = "nullable"
}

export function readonly(target: Entity, propertyKey: string|Symbol, descriptor: PropertyDescriptor) {
    descriptor.writable = false;
    return descriptor;
}  

export function primaryKey(target: Entity, propertyKey: string): void{
    TypeUtility.setTypeProperty(target, propertyKey as string, TypeProperty.PRIMARY_KEY);
}

export function generated(target: Entity, propertyKey: string) {
    TypeUtility.setTypeProperty(target, propertyKey as string, TypeProperty.GENERATED);
}

export function nullable(target: Entity, propertyKey: string) {
    TypeUtility.setTypeProperty(target, propertyKey, TypeProperty.NULLABLE);
}
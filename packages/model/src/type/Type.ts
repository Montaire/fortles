import { Entity, ErrorReporter, TypeUtility } from "../index.js";
import { Exportable, ExportedData, ClassSerializer } from "../utlity/ClassSerializer.js";

export type EntityFieldDecorator = (value: any, context: ClassFieldDecoratorContext) => void;

/**
 * Callable, that returns null on success, and the error message on fail.
 */
export type Validation<T> = (value: T) => string | null

/**
 * - Validation
 * - Conversion (serialization, deserialization, sql->extendable)
 * - Formatting
 */
export abstract class Type<T,C> implements Exportable{

    protected propertyMap = new Map<string, any>();

    protected validations: Validation<T>[] = [];

    protected name: string;

    protected config: C;

    public constructor(
        name: string | symbol, 
        config: C, propertyMap: Map<string, Object> = new Map<string, Object>(), 
        validations: Validation<T>[] = []
    ){
        this.name = name.toString();
        this.config = config;
        this.propertyMap = propertyMap;
        this.validations = validations;
        ClassSerializer.register(this.constructor as any);
    }

    public setProperty(name: string, value: Object|null = null): void{
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

    public export(): ExportedData {
        return{
            type: this.constructor.name,
            name: this.name,
            config: this.config,
            propertyMap: Array.from(this.propertyMap.entries()),
            //TODO: investigetae vether validators should be exported.
            //validations: this.validations
        };
    }

    public import(source: ExportedData): void {
        this.name = source.name;
        this.config = source.config;
        this.propertyMap = new Map(source.propertyMap);
        //TODO: investigetae vether validators should be exported.
        //this.validations = source.validations;
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

export function readonly(value: any, context: ClassFieldDecoratorContext, descriptor: PropertyDescriptor) {
    descriptor.writable = false;
    return descriptor;
}  

export function primaryKey<T = any>(value: undefined, context: ClassFieldDecoratorContext){
    return function(this: Entity, value: T): T{
        TypeUtility.setTypeProperty(this, context.name, TypeProperty.PRIMARY_KEY);
        return value;
    };
}

export function generated<T = any>(value: undefined, context: ClassFieldDecoratorContext) {
    return function(this: Entity, value: T): T{
        TypeUtility.setTypeProperty(this, context.name, TypeProperty.GENERATED);
        return value;
    };
}

export function nullable<T = any>(value: undefined, context: ClassFieldDecoratorContext) {
    return function(this: Entity, value: T){
        TypeUtility.setTypeProperty(this, context.name, TypeProperty.NULLABLE);
        return value;
    };
}
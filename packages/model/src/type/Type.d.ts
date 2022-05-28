import { Entity, ErrorReporter } from "../index.js";
export declare type EntityPropertyDecorator = (target: Entity, propertyKey: string | symbol) => void;
/**
 * Callable, that returns null on success, and the error message on fail.
 */
export declare type Validation<T> = (value: T) => string | null;
/**
 * - Validation
 * - Conversion (serialization, deserialization, sql->extendable)
 * - Formatting
 */
export declare abstract class Type<T, C> {
    protected propertyMap: Map<string, Object>;
    protected validations: Validation<T>[];
    protected config: C;
    constructor(config: C);
    setProperty(name: string, value?: Object): void;
    getProperty(name: string): Object;
    getConfig(): C;
    hasProperty(name: string): boolean;
    /**
     * Adds a validation
     * @param validation A validation is a callable, that should return null on success, the error message on fail.
     */
    addValidation(validation: Validation<T>): void;
    /**
     * Parses a value what was given on the user side. Validations wil run on successful parsing.
     * @param input Input to process
     * @param errorReporter Report errors here if the conversion fails. If an error were reported, the parsing fails regardless of the output.
     * @returns The converted value, or null if the input recognised as a null value.
     */
    abstract parse(input: string, errorReporter: ErrorReporter): T | null;
    /**
     * Validates a property with the given rules.
     * validation happens after parsing to the target type.
     * @param value Value to valudate
     * @returns Array of the errors
     */
    validate(value: T): string[];
}
export declare enum TypeProperty {
    PRIMARY_KEY = "primaryKey",
    GENERATED = "generated",
    HAS_ONE = "hasOne",
    HAS_MANY = "hasMany",
    BELONGS_TO = "belongsTo",
    BELONGS_TO_MANY = "belongsToMany",
    NULLABLE = "nullable"
}
export declare function readonly(target: Entity, propertyKey: string | Symbol, descriptor: PropertyDescriptor): PropertyDescriptor;
export declare function primaryKey(target: Entity, propertyKey: string | Symbol): void;
export declare function generated(target: Entity, propertyKey: string | Symbol): void;
export declare function nullable(target: Entity, propertyKey: string | Symbol): void;

/**
 * Serializes classes to JSON, and also it can export and import them into objects.
 * Classes must be registered with {@link ClassSerializer.register()}!
 */
export class ClassSerializer{

    /**
     * This map stores the constructors for the correspondng class names.
     * @see {@link ClassSerializer.register()} for register a class to this map.
     * @see {@link ClassSerializer.import()} as this function needs this to work properly.
     */
    protected static classMap = new Map<string, new () => Exportable>();

    /**
     * Register the type of the class.
     * For deserialization, the constructor is needed to restore the data.
     * @param classType Consturctor of the class to deserialize.
     */
    public static register(classType: {new (...args: any[]): any}){
        if(!this.classMap.has(classType.name)){
            this.classMap.set(classType.name, classType);
        }
    }

    public static getConstructor<T>(className: string): new() => T{
        return this.classMap.get(className) as (new() => T);
    }

    /**
     * Serializes a class into JSON.
     * @param instance The class intstance to be serialized.
     * @returns The serialized class.
     * @see {@link ClassSerializer.export()} will process the parsed string.
     */
    public static serialize(instance: Exportable | object): string{
        const exported = this.export(instance);
        return JSON.stringify(exported);
    }

    /**
     * Deserializes a class from json.
     * Classes must be registered registered with {@link ClassSerializer.register()}!
     * @param source The JSON representation of the class.
     * @returns The class insance.
     * @see {@link ClassSerializer.import()} its result is converted here to JSON.
     */
    public static deserialize<T>(source: string): T{
        const importable = JSON.parse(source);
        return this.import(importable);
    }

    /**
     * Imports a class from {@link ExportedObject}.
     * Classes must be registered registered with {@link ClassSerializer.register()}!
     * @param source The custom object representation.
     * @returns The class intance.
     */
    public static import<T>(source: ExportedObject): T{
        const classType = this.classMap.get(source.type);
        if(!classType){
            throw new Error(source.type + " can not be serialies. The class type is not registered to the serializer.");
        }
        const instance = new classType();
        if(instance.import){
            instance.import(source.data);
        }else{
            Object.assign(instance, source.data);
        }
        return instance as T;
    }

    /**
     * Exports a class into a {@link ExportedObject}.
     * @param instance Class to serialize.
     * @returns Custom object representation of the class.
     */
    public static export(instance: Exportable | object): ExportedObject {
        let data = {};
        if((instance as Exportable).export){
            data = (instance as any).export();
        }else{
            Object.assign(data, instance);
        }
        return {
            type: instance.constructor.name,
            data: data
        };
    }

    public static serializable(classType: {new (...args: any[]): any} , context: ClassDecoratorContext){
        ClassSerializer.register(classType);
    }
}

/**
 * Data stored by the class.
 * This should be the least amount of data, from the class can be restored.
 */
export type ExportedData = {
    [key: string]: any
}

/**
 * Custom object, that represents an object.
 * @param type Name of the constructor. The constructor is stored after calling {@link ClassSerializer.register()}
 * @param data Data stored by the class.
 */
export type ExportedObject = {
    type: string,
    data: ExportedData
}

/**
 * Interface for serializable classes.
 */
export interface Exportable{
    /**
     * Exports a class to an object.
     * If not defined, Object assign will be used.
     * @returns Serialzed object
     */
    export?(): ExportedData;

    /**
     * Imports the given data to itself.
     * If not defined object assign will be used.
     * @param source Object to deserialize
     * @returns Nothing
     */
    import?(source: ExportedData): void;
}
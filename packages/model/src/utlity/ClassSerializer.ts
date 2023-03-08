/**
 * Serializes classes to objects and back
 * It keeps a list of the class constructors.
 */
export class ClassSerializer{

    protected static classMap = new Map<string, new () => Serializable>();

    public static serialize(instance: Serializable): Serialized {
        let data = {};
        if(instance.serialize){
            data = instance.serialize();
        }else{
            Object.assign(data, instance);
        }
        return {
            type: instance.constructor.name,
            data: data
        };
    }

    public static deserialize<T extends Serializable = Serializable>(source: Serialized): T{
        const classType = this.classMap.get(source.type);
        if(!classType){
            throw new Error(source.type + " can not be serialies. The class type is not registered to the serializer.");
        }
        const instance = new classType();
        if(instance.deserialize){
            instance.deserialize(source.data);
        }else{
            Object.assign(instance, source.data);
        }
        return instance as T;
    }
}

type SerializedData = {
    [key: string]: any
}

type Serialized = {
    type: string,
    data: SerializedData
}

/**
 * Interface for serializable classes.
 */
export interface Serializable{
    /**
     * Serializes a class to an object.
     * If not defined, Object assign will be used.
     * @returns Serialzed object
     */
    serialize?: () => SerializedData;

    /**
     * Deserializes the given data to itself.
     * If not defined object assign will be used.
     * @param source Object to deserialize
     * @returns Nothing
     */
    deserialize?: (source: SerializedData) => void;
}
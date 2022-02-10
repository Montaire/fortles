/**
 * - Validation
 * - Conversion (serialization, deserialization, sql->extendable)
 * - Formatting
 */
export default class Type<T>{

}

export function readonly(target:any, name:string, descriptor: PropertyDescriptor) {
    descriptor.writable = false;
    return descriptor;
}  
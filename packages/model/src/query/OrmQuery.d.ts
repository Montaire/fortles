import { Query } from "../index.js";
export default class OrmQuery<T> extends Query<T> {
    where(condition: (item: T) => boolean): this;
    orderBy(field: (item: T) => any): this;
    protected parseArrowFunction(arrowFunction: string): void;
    [Symbol.iterator](): Iterator<T, any, undefined>;
}
export declare function orm(target: any, propertyKey: string, descriptor: PropertyDescriptor): void;

import { Query } from "../index.js";

export default class TranspilerQuery<T> extends Query<T>{
    where(condition: (item: T) => boolean): this {
        console.log(condition);
        return this;
    }
    orderBy(field: (item: T) => any): this {
        throw new Error("Method not implemented.");
    }

}
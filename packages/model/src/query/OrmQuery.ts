import { Query } from "../index.js";

export default class OrmQuery<T> extends Query<T>{

    public where(condition: (item: T) => boolean): this {
        const variables = arguments[1];
        if(variables == undefined){
            throw new Error("Mark this function with the '@orm' decorator!");
        }
        return this;
    }

    public orderBy(field: (item: T) => any): this {
        throw new Error("Method not implemented.");
    }

    protected parseArrowFunction(arrowFunction: string){
        let parts = arrowFunction.split("=>");
        if(parts.length != 2){
            throw new Error("In OrmQueries only arrow functions are available.");
        }
        let argument = parts[0].trim();
        let code = parts[1].replace(/^\s*(.+)\s*$/, "$1");

    }

    [Symbol.iterator](): Iterator<T, any, undefined> {
        throw new Error("Method not implemented.");
    }
}

export function orm(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let original = descriptor.value.toString();
    original = original.replace('where(x => x.id == id)', 'where(x => x.id == id,[id])');
    eval("descriptor.value = function " + original);
}
import { RuntimeError } from "../../core/Error.js";
import { Query } from "../index.js";

export default class TranspilerQuery<T> extends Query<T>{

    public where(condition: (item: T) => boolean): this {
        const variables = arguments[1];
        if(variables == undefined){
            throw new RuntimeError("Mark this function with the '@query' decorator!");
        }
        console.log(condition);
        return this;
    }

    public orderBy(field: (item: T) => any): this {
        throw new Error("Method not implemented.");
    }

    protected parseArrowFunction(code: string){

    }
}

export function query(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let original = descriptor.value.toString();
    original = original.replace('where(x => x.id == id)', 'where(x => x.id == id,[id])');
    eval("descriptor.value = function " + original);
  }
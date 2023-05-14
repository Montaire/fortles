import { Entity, Query } from "../index.js";

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

function processLambda(functionList: string[], input: string): string {
    const pattern = /([a-zA-Z_$][0-9a-zA-Z_$]*(?:\[\d+\])?(?:\.[a-zA-Z_$][0-9a-zA-Z_$]*(?:\[\d+\])?)*[^"'])/g;

    return input.replace(/(\w+)\((.*?)\)/g, (match, func, args) => {
        if (!functionList.includes(func)) return match;

        const [lambdaVar, expr] = args.split('=>').map((s: any) => s.trim());

        let params = Array.from(expr.matchAll(pattern))
            .map((m: any) => m[0])
            .filter(v => v !== func && !v.startsWith(lambdaVar + '.') && v !== lambdaVar && isNaN(Number(v)))
            .reduce((obj, v) => ({ ...obj, [v]: v }), {});

        return `${func}(${args}, ${JSON.stringify(params)})`;
    });
}

export function orm(value: Function, context: ClassMethodDecoratorContext) {
    return function(this: Entity){
        const input = value.toString();
        const functionList = ["where"];
        const result = processLambda(functionList, input);
        console.log(result);
        return eval("function " + result);
    }
}
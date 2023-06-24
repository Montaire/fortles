import { Entity, Query } from "../index.js";

export default class ExpressionQuery<E extends Entity> extends Query<E>{

    public override where(condition: (item: E) => boolean): this {
        const variables = arguments[1];
        if(variables == undefined){
            throw new Error("Mark this function with the '@orm' decorator!");
        }
        return this;
    }

    public override orderBy(field: (item: E) => any): this {
        throw new Error("Method not implemented.");
    }

    protected parseArrowFunction(arrowFunction: string){
        let parts = arrowFunction.split("=>");
        if(parts.length != 2){
            throw new Error("In ExpressionQueries only arrow functions are available.");
        }
        let argument = parts[0].trim();
        let code = parts[1].replace(/^\s*(.+)\s*$/, "$1");
    }

    [Symbol.iterator](): Iterator<E, any, undefined> {
        throw new Error("Method not implemented.");
    }
}

function processLambda(functionList: string[], input: string): string {
    return input.replace(/(\w+)\((.*?)\)/g, (match: string, func: string, args: string) => {
        if (!functionList.includes(func)) return match;

        const [lambdaVar, expr] = args.split('=>').map(s => s.trim());

        // Remove all white spaces
        let exprNoSpace = expr.replace(/\s/g, '');

        // Split by operators
        let tokens = exprNoSpace.split(/(\|\||&&|==|!=|>=|<=|>|<|\+|-|\*|\/|!)/);

        // Create params by filtering tokens that don't start with lambda variable, but do start with a letter
        let params = tokens
            .filter(v => v !== func && !v.startsWith(lambdaVar + '.') && v !== lambdaVar && /^[a-zA-Z].*/.test(v))
            .reduce((obj, v) => ({ ...obj, [v]: v }), {});

        return `${func}(${args}, {${Object.entries(params).map(([k, v]) => `"${k}": ${v}`).join(', ')}})`;
    });
}

export function expression(value: Function, context: ClassMethodDecoratorContext) {
    return function(this: Entity){
        const input = value.toString();
        const functionList = ["where"];
        const result = processLambda(functionList, input);
        console.log(result);
        return eval("function " + result);
    }
}
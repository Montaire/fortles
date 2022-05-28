import { Query } from "../index.js";
export default class OrmQuery extends Query {
    where(condition) {
        const variables = arguments[1];
        if (variables == undefined) {
            throw new Error("Mark this function with the '@orm' decorator!");
        }
        return this;
    }
    orderBy(field) {
        throw new Error("Method not implemented.");
    }
    parseArrowFunction(arrowFunction) {
        let parts = arrowFunction.split("=>");
        if (parts.length != 2) {
            throw new Error("In OrmQueries only arrow functions are available.");
        }
        let argument = parts[0].trim();
        let code = parts[1].replace(/^\s*(.+)\s*$/, "$1");
    }
    [Symbol.iterator]() {
        throw new Error("Method not implemented.");
    }
}
export function orm(target, propertyKey, descriptor) {
    let original = descriptor.value.toString();
    original = original.replace('where(x => x.id == id)', 'where(x => x.id == id,[id])');
    eval("descriptor.value = function " + original);
}
//# sourceMappingURL=OrmQuery.js.map
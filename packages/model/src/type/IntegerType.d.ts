import { Type } from "./index.js";
import ErrorReporter from "../ErrorReporter.js";
declare type IntegerTypeConfig = {
    min?: number;
    max?: number;
};
export declare class IntegerType extends Type<number, IntegerTypeConfig> {
    parse(input: string, error: ErrorReporter): number;
    constructor(config?: IntegerTypeConfig);
}
export declare function integer(config?: IntegerTypeConfig): PropertyDecorator;
export {};

import { Type, EntityPropertyDecorator } from "./index.js";
import ErrorReporter from "../ErrorReporter.js";
export declare type StringTypeConfig = {
    fixed?: boolean;
    length?: number;
};
export declare class StringType extends Type<string, StringTypeConfig> {
    parse(input: string, reporter: ErrorReporter): string;
    constructor(config?: StringTypeConfig);
}
export declare function string(config?: StringTypeConfig): EntityPropertyDecorator;

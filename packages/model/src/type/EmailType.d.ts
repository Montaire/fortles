import { EntityPropertyDecorator } from "./index.js";
import { StringType } from "./StringType.js";
import ErrorReporter from "../ErrorReporter.js";
export declare type EmailTypeConfig = {
    length?: number;
    checkMx?: false;
};
export declare class EmailType extends StringType {
    parse(input: string, reporter: ErrorReporter): string;
    constructor(config?: EmailTypeConfig);
}
export declare function email(config?: EmailTypeConfig): EntityPropertyDecorator;

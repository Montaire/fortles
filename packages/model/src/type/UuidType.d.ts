import { EntityPropertyDecorator, StringType } from "./index.js";
export declare type UuidTypeConfig = {
    generated?: boolean;
};
export declare class UuidType extends StringType {
    constructor(config?: UuidTypeConfig);
    generate(): string;
}
export declare function uuid(config?: UuidTypeConfig): EntityPropertyDecorator;

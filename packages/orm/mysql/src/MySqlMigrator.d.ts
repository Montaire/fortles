/// <reference types="node" />
import { Entity, IntegerType, StringType, Type, AssociationType } from "@fortles/model";
import { Encoding } from "crypto";
export declare type MySqlMigratorConfig = {
    charLength?: number;
    encoding?: Encoding;
    defaultPrimaryKey?: {
        name?: string;
        type?: string;
        modifier?: string;
    };
};
export default class MySqlMigrator {
    protected connection: any;
    protected config: MySqlMigratorConfig;
    protected rowSize: number;
    constructor(connection: any);
    create(entityTypes: Iterable<typeof Entity> | typeof Entity[], reset?: boolean): Promise<void>;
    protected createForeignKeyQuery(association: AssociationType<any>): void;
    protected createTableQuery(entityType: typeof Entity, reset?: boolean, appendForeignKeys?: boolean): string;
    protected createPrimitiveType(type: Type<any, any>, modifier?: boolean): string;
    protected createIntegerType(type: IntegerType, modifier?: boolean): string;
    protected createStringType(type: StringType, modifier?: boolean): string;
}

import { Entity, EntityAdapter, SchemaChange, SchemaAdapter } from "@fortles/model";
import { MySqlDriver }from "../MySqlDriver.js";
import { AlterSchema } from "@fortles/model/src/adapter/Schema.js";
export class MySqlSchemaAdapter extends SchemaAdapter<MySqlDriver> {
    override async create(schema: SchemaChange): Promise<void> {
        throw new Error("Method not implemented.");
    }
    override async drop(name: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    override async alter(schema: AlterSchema): Promise<void> {
        throw new Error("Method not implemented.");
    }

}
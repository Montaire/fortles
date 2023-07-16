import { Entity, EntityAdapter, SchemaChange, SchemaAdapter, DropSchemaChange, CreateSchemaChange, AlterSchemaChange } from "@fortles/model";
import { MySqlDriver }from "../MySqlDriver.js";
import { AlterSchema } from "@fortles/model/src/adapter/Schema.js";
export class MySqlSchemaAdapter extends SchemaAdapter<MySqlDriver> {
    override async create(schema: CreateSchemaChange): Promise<void> {
        throw new Error("Method not implemented.");
    }
    override async drop(schema: DropSchemaChange): Promise<void> {
        throw new Error("Method not implemented.");
    }
    override async alter(schema: AlterSchemaChange): Promise<void> {
        throw new Error("Method not implemented.");
    }

}
import { Entity, EntityAdapter, SchemaChange, SchemaAdapter, DropSchemaChange, CreateSchemaChange, AlterSchemaChange } from "@fortles/model";
import { MySqlDriver }from "../MySqlDriver.js";
import { AlterSchema } from "@fortles/model/src/adapter/Schema.js";
import { PoolConnection } from "mysql2/promise";
export class MySqlSchemaAdapter extends SchemaAdapter<PoolConnection> {

    override async create(schema: CreateSchemaChange): Promise<void> {
        let statement = "CREATE TABLE " + schema.getName() + " (\n";

        statement += "\n);"
        await this.nativeConnection.execute(statement);
    }
    override async drop(schema: DropSchemaChange): Promise<void> {
        const statement = "DROP TABLE " + schema.getName();
        await this.nativeConnection.execute(statement)
    }
    override async alter(schema: AlterSchemaChange): Promise<void> {
        throw new Error("Method not implemented.");
    }

}
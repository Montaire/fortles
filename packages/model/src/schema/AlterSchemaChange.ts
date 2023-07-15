import { Connection, SchemaChange } from "../index.js";

export class AlterSchemaChange extends SchemaChange{
    public override async applyTo(connection: Connection): Promise<void> {
        return connection.alter(this);
    }
}
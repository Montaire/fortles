import { Connection, Driver, SchemaChange } from "../index.js";

export class DropSchemaChange extends SchemaChange{
    public override async applyTo(connection: Connection): Promise<void> {
        return connection.drop(this);
    }

}
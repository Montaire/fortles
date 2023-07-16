import { Connection, Driver, EntityDescriptor, SchemaChange } from "../index.js";

export class DropSchemaChange extends SchemaChange{
    public override async applyTo(connection: Connection): Promise<void> {
        return connection.getSchema().drop(this);
    }
    static createFromEntityDescriptor(entityDescriptor: EntityDescriptor){
        const schemaChanage = new this(entityDescriptor.getName());
        return schemaChanage;
    }
}
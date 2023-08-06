import { AlterSchema } from "../../src/adapter/Schema.js";
import { CreateSchemaChange, Driver, Entity, EntityAdapter, SchemaChange, SchemaAdapter, Connection } from "../../src/index.js";
import { DropSchemaChange } from "../../src/schema/DropSchema.js";

export class TestSchemaAdapter extends SchemaAdapter<TestDriver>{

    public created: CreateSchemaChange[] = [];
    public dropped: DropSchemaChange[] = [];
    public altered: AlterSchema[] = [];

    override async create(schema: CreateSchemaChange): Promise<void> {
        this.created.push(schema);
    }
    override async drop(name: DropSchemaChange): Promise<void> {
        this.dropped.push(name);
    }
    override async alter(schema: AlterSchema): Promise<void> {
        this.altered.push(schema);
    }

}

export class TestDriver extends Driver{
    public override createConnection(name: string = "default"): Connection<this> {
            return new Connection(name, this);
    }
    protected override schemaAdapter = new TestSchemaAdapter(this);

}
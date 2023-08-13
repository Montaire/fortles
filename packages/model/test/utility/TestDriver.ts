import { Test } from "mocha";
import { AlterSchema } from "../../src/adapter/Schema.js";
import { CreateSchemaChange, Driver, Entity, EntityAdapter, SchemaChange, SchemaAdapter, Connection, TransactionAdapter } from "../../src/index.js";
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

export class TestTransactionAdapter extends TransactionAdapter<TestDriver>{

}

export class TestEntityAdapter extends EntityAdapter{
    override importEntity(data: object): Entity {
        throw new Error("Method not implemented.");
    }
    override exportEntity(entity: Entity): object {
        throw new Error("Method not implemented.");
    }
}

export class TestDriver extends Driver<any>{

    public override async createConnection(): Promise<Connection<TestDriver>>{
            return new Connection<TestDriver>(
                this,
                this,
                new TestSchemaAdapter(this),
                new TestTransactionAdapter(this),
                new TestEntityAdapter()
            );
    }

}
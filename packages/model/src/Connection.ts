import { AlterSchemaChange, CreateSchemaChange, Driver, Entity, Query, SchemaChange } from "./index.js";
import { DropSchemaChange } from "./schema/DropSchema.js";

export class Connection<D extends Driver = Driver>{

    protected driver: D;

    constructor(driver: D){
        this.driver = driver;
    }

    public async create(schema: CreateSchemaChange): Promise<void>{
        this.driver.getSchemaAdapter().create(schema);
    }

    public async alter(schema: AlterSchemaChange): Promise<void>{
        this.driver.getSchemaAdapter().alter(schema);
    }

    public async drop(schema: DropSchemaChange): Promise<void>{
        this.driver.getSchemaAdapter().drop(schema);
    }

    public query<E extends Entity>(entityType: new() => E): Query<E, this>{
        throw "changing";
    }

    public getDriver(): D{
        return this.driver;
    }

    public beginTransaction(): void{

    }

    public endTransaction(): void{

    }
}
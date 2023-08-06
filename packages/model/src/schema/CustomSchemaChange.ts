import { Connection, SchemaChange } from "../index.js";

export class CustomShemaChange extends SchemaChange{

    protected action: (connection: Connection) => Promise<void>

    constructor(action: (connection: Connection) => Promise<void>){
        super("");
        this.action = action;
    }

    public override async applyTo(connection: Connection): Promise<void> {
        return await this.action(connection);
    }

}
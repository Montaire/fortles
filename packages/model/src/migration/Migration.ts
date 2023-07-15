import { Connection, SchemaChange, CreateSchemaChange, DropSchemaChange } from "../index.js";
import { CustomShemaChange } from "../schema/CustomSchemaChange.js";

class Migration {
    private connection: Connection;
    private schemaChanges: SchemaChange[] = [];
    private isUp: boolean = true;  // set this according to your migration direction logic
  
    constructor(connection: Connection) {
      this.connection = connection;
    }
  
    public create(name: string): CreateSchemaChange {
      const change = new CreateSchemaChange(name);
      this.schemaChanges.push(change);
      return change;
    }
  
    public up(callback: (connection: Connection) => Promise<void>): void {
      //Only add tho the change queue if the direction matches
      if(this.isUp){
        const change = new CustomShemaChange(callback);
        this.schemaChanges.push(change);
      }
    }
  
    public drop(name: string): void {
      let change = new DropSchemaChange(name);  // replace with your actual logic
      this.schemaChanges.push(change);
    }
  
    /**
     * Runs all the transactions for this migration.
     * Only run it manually if really necessary.
     */
    public async apply(): Promise<void> {
        this.connection.beginTransaction();
        for (let change of this.schemaChanges) {
            //We are awaiting to ensure the correct order
            await change.applyTo(this.connection);
        }
        this.connection.endTransaction();
        this.schemaChanges = [];
    }
  }
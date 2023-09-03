import { Connection, SchemaChange, CreateSchemaChange, DropSchemaChange, AlterSchemaChange, TypeProperty, CustomShemaChange } from "../index.js";
import { WriteStream, createWriteStream } from "fs";

export class Migration {
    private schemaChanges: SchemaChange[];

    constructor(schemaChanges: SchemaChange[] = []) {
        this.schemaChanges = schemaChanges;
    }

    public create(name: string): CreateSchemaChange {
        const change = new CreateSchemaChange(name);
        this.schemaChanges.push(change);
        return change;
    }

    public drop(name: string): void {
        const change = new DropSchemaChange(name);
        this.schemaChanges.push(change);
    }

    public alter(name: string, newName?: string): AlterSchemaChange {
        const change = new AlterSchemaChange(name, newName);
        this.schemaChanges.push(change);
        return change;
    }

    public custom(action: (connection: Connection) => Promise<void>): void{
        const change = new CustomShemaChange(action);
    }

    /**
     * Override this function to building this database.
     */
    public up(): void {

    }

    /**
     * This function will be called on rollback.
     * @param connection Connection to run custom queries.
     */
    public down(): void {

    }

    /**
     * Runs all the transactions for this migration.
     * Only run it manually if really necessary.
     */
    public async applyTo(connection: Connection): Promise<void> {
        this.schemaChanges = [];
        this.up();
        connection.beginTransaction();
        for (const change of this.schemaChanges) {
            //We are awaiting to ensure the correct order
            await change.applyTo(connection);
        }
        connection.endTransaction();
    }

    public async applyRollbackTo(connection: Connection): Promise<void>{
        this.schemaChanges = [];
        this.down();
        connection.beginTransaction();
        for(const change of this.schemaChanges){
            await change.applyTo(connection);
        }
        connection.endTransaction();
    }

    public async save(path: string, name: string): Promise<void> {
        const writeStream = createWriteStream(path);
        writeStream.write("import { Migration } from\"@fortles/model\";");
        writeStream.write("\n\nexport default class ");
        if(name){
            writeStream.write(name + " ");
        }
        writeStream.write("extends Migration{");

            //Up
            writeStream.write("\n\n\toverride up(){")
            for (const schemaChange of this.schemaChanges) {
                this.saveSchemaChange(writeStream, schemaChange);
            }
            writeStream.write("\n\t}");

            //Down with reversed order
            writeStream.write("\n\n\toverride down(){")
            for (const schemaChange of this.schemaChanges.reverse()) {
                const reversedSchemaChange = schemaChange.getReversed();
                if(reversedSchemaChange){
                    this.saveSchemaChange(writeStream, reversedSchemaChange);
                }
            }
            writeStream.write("\n\t}");
        
        writeStream.write("\n}");
    }

    protected saveSchemaChange(writeStream: WriteStream, schemaChanage: SchemaChange){
        
        //Start definition
        if(schemaChanage instanceof AlterSchemaChange){
            writeStream.write("\n\t\tmigration.create(\"" + schemaChanage.getName() + "\")");
        }else if(schemaChanage instanceof CreateSchemaChange){
            writeStream.write("\n\t\tmigration.alter(\"" + schemaChanage.getName() + "\")");
        }else if(schemaChanage instanceof DropSchemaChange){
            writeStream.write("\n\t\tmigration.drop(\"" + schemaChanage.getName() + "\")");
            return;
        }

        //Save create columns
        if ((
                schemaChanage instanceof CreateSchemaChange ||
                schemaChanage instanceof AlterSchemaChange
            ) 
            && schemaChanage.getCreateFieldMap().size > 0
        ) {
            for(const [fieldName, fieldType] of schemaChanage.getCreateFieldMap()){
                writeStream.write("\n\t\t\t.addField(\"" + fieldName + "\")");
                this.saveProperties(writeStream, fieldType.getPropertyMap());
            }
        }
        
        if(schemaChanage instanceof AlterSchemaChange){
            if(schemaChanage.getAlterFieldMap().size > 0){
                for(const [fieldName, fieldType] of schemaChanage.getCreateFieldMap()){
                    writeStream.write("\n\t\t\t\.addField(\"" + fieldName);
                    if(schemaChanage.getNewName()){
                        writeStream.write(", \"" + schemaChanage.getNewName() + "\"");
                    }
                    writeStream.write(")");
                    this.saveProperties(writeStream, fieldType.getPropertyMap());
                }
            }

            if(schemaChanage.getDropFields().length > 0){
                for(const fieldName of schemaChanage.getDropFields()){
                    writeStream.write("\n\t\t\t.dropField(\"" + fieldName + "\")");
                }
            }
        }

        writeStream.write(";");
    }

    protected saveProperties(writeStream: WriteStream, propertyMap: Map<string, Object>){
        for(const [propertyKey, propertyValue] of propertyMap){
            switch(propertyKey){
                case TypeProperty.PRIMARY_KEY :
                    writeStream.write(".primaryKey()")
                    break;
            }
        }
    }
}
import { Connection, SchemaChange, CreateSchemaChange, DropSchemaChange, CustomShemaChange, AlterSchemaChange, TypeProperty } from "../index.js";
import { WriteStream, createWriteStream } from "fs";

export class Migration {
    private schemaChanges: SchemaChange[];
    private isUp: boolean = true;  // set this according to your migration direction logic

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

    public up(callback: (connection: Connection) => Promise<void>): void {
        //Only add tho the change queue if the direction matches
        if (this.isUp) {
            const change = new CustomShemaChange(callback);
            this.schemaChanges.push(change);
        }
    }

    public down(callback: (connection: Connection) => Promise<void>): void {
        //Only add tho the change queue if the direction matches
        if (!this.isUp) {
            const change = new CustomShemaChange(callback);
            this.schemaChanges.push(change);
        }
    }

    /**
     * Runs all the transactions for this migration.
     * Only run it manually if really necessary.
     */
    public async applyTo(connection: Connection): Promise<void> {
        connection.beginTransaction();
        for (const change of this.schemaChanges) {
            //We are awaiting to ensure the correct order
            await change.applyTo(connection);
        }
        connection.endTransaction();
    }

    public async applyRollbackTo(connection: Connection): Promise<void>{
        //TODO: The tricky part will be that we do not actually know in case of alter or drop, what was the original type.
        //A: Build From the bottom to see the type. -> Create a migration compressor, which adds up all migration into one file.
        //B: Rollback to the latest migration what was the type before.
        //C: Create up and down methods, and on creation save the original type.
        connection.beginTransaction();
        for(const change of this.schemaChanges){

        }
        connection.endTransaction();
    }

    public async save(path: string): Promise<void> {
        const writeStream = createWriteStream(path);
        writeStream.write("import { Migration } from\"@fortles/model\";\n\n");
        writeStream.write("export default function(migration: Migration){\n");
        for (const schemaChange of this.schemaChanges) {
            this.saveSchemaChange(writeStream, schemaChange);
        }
        writeStream.write("}");
    }

    protected saveSchemaChange(writeStream: WriteStream, schemaChanage: SchemaChange){
        
        //Start definition
        if(schemaChanage instanceof AlterSchemaChange){
            writeStream.write("\n\tmigration.create(\"" + schemaChanage.getName() + "\")");
        }else if(schemaChanage instanceof CreateSchemaChange){
            writeStream.write("\n\tmigration.alter(\"" + schemaChanage.getName() + "\")");
        }else if(schemaChanage instanceof DropSchemaChange){
            writeStream.write("\n\tmigration.drop(\"" + schemaChanage.getName() + "\")");
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
                writeStream.write("\t\tmigration.addField(\"" + fieldName + "\")");
                this.saveProperties(writeStream, fieldType.getPropertyMap());
            }
        }
        
        if(schemaChanage instanceof AlterSchemaChange){
            if(schemaChanage.getAlterFieldMap().size > 0){
                for(const [fieldName, fieldType] of schemaChanage.getCreateFieldMap()){
                    writeStream.write("\t\tmigration.addField(\"" + fieldName);
                    if(schemaChanage.getNewName()){
                        writeStream.write(", \"" + schemaChanage.getNewName() + "\"");
                    }
                    writeStream.write(")");
                    this.saveProperties(writeStream, fieldType.getPropertyMap());
                }
            }

            if(schemaChanage.getDropFields().length > 0){
                for(const fieldName of schemaChanage.getDropFields()){
                    writeStream.write("\t\tmigration.dropField(\"" + fieldName + "\")");
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
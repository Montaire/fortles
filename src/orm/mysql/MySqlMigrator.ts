import { Entity, IntegerType, StringType, Type, AssociationType, OneAssociationType, HasOneAssociationType, HasManyAssociationType } from "@fortles/model";
import { Encoding } from "crypto";

type MySqlMigratorConfig = {
    charLength?: number,
    encoding?: Encoding,
    defaultPrimaryKey?: {
        name?: string,
        type?: string,
        modifier?: string
    }
}

export default class MySqlMigrator{

    protected connection;

    protected config: MySqlMigratorConfig = {
        charLength: 255,
        encoding: "utf-8",
        defaultPrimaryKey: {
            type: "INT UNSIGNED",
            modifier: "AUTO_INCREMENT PRIMARY KEY"
        }

    };

    protected rowSize: number;

    constructor(connection){
        this.connection = connection;
    }

    async create(entityTypes: Iterable<typeof Entity> | typeof Entity[], reset:boolean = false){
        //Build tasks
        for(const entityType of entityTypes){
            
        }
        //Create tables

        //Create techincal tables

        //Create foreign keys
    }

    protected createForeignKeyQuery(association: AssociationType<any>){
        let target = association.getTarget();
        let primaryKeys = target.getPrimaryKeys();

        if(association instanceof HasOneAssociationType){

        }

        if(association instanceof HasManyAssociationType){

        }
    
    }

    protected createTableQuery(entityType: typeof Entity, reset = false, appendForeignKeys = false): string{
        let tableName = entityType.name;
        let sql = "CREATE TABLE `" + tableName + "` (\n";
        let rows: string[] = [];
        let pefix: string[] = [];
        //If entity has no primary key defined add the Connections default one.
        if(!entityType.getPrimaryKeys()){
            let pk = this.config.defaultPrimaryKey;
            rows.push("\t `id` " + pk.type + " " + pk.modifier);
        }
        for(const [fieldName, type] of entityType.typeMap){
            if(type instanceof AssociationType){
                //Only has ones foreign key
                if(type instanceof OneAssociationType){
                    let target = type.getTarget();
                    let primaryKeys = target.getPrimaryKeys();
                    if(!primaryKeys){
                        primaryKeys = ["id"];
                    }
                    for(const keyName of primaryKeys){
                        let row = "\t`" + fieldName + "`" + this.createPrimitiveType(target.getType(keyName));
                        if(appendForeignKeys){
                            row += "REFERENCES " + target.name + "(" + keyName +")";
                            rows.push(row);
                        }
                    }
                }
            }else{
                rows.push("\t`" + fieldName + "`" + this.createPrimitiveType(type));
            }
        }
        sql += rows.join(",\n");
        sql += '\n);';
        return sql;
    }

    protected createPrimitiveType(type: Type<any,any>, modifier: boolean = true): string{
        let result = "";

        if(type instanceof IntegerType){
            result += this.createIntegerType(type, modifier);
        }else if(type instanceof StringType){
            result += this.createStringType(type, modifier);
        }

        if(modifier && type.hasProperty("primaryKey")){
            result += " PRIMARY KEY";
        }

        return result;
    }

    protected createIntegerType(type: IntegerType, modifier: boolean = true): string{
        let result = "";
        result += " INT";
        if(modifier && type.hasProperty("generated")){
            result += " AUTO_INCREMENT";
        }
        return result;
    }

    protected createStringType(type: StringType, modifier: boolean = true): string{
        let result = "";
        let length = type.getConfig().length ?? 80;
        if(!length || length < this.config.charLength){
            result += type.getConfig().fixed ? " CHAR" : " VARCHAR";
        }else{
            result += " TEXT";
        }
        if(length){
            result += "(" + length + ")"
        }
        return result;
    }
}

class TaskResolver<T extends Task<K>, K>{
    add(task: T){

    }

    run(){

    }

    buildDependacyGraph(){

    }
}

class Task<T>{
    depends 
    run(){}
}
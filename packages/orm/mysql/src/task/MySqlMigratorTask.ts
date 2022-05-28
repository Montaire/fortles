import { IntegerType, StringType, Type } from "@fortles/model";
import { MySqlMigratorConfig } from "../MySqlMigrator";


export default abstract class MySqlMigratorTask{

    protected config: MySqlMigratorConfig = {
        charLength: 255,
        encoding: "utf-8",
        defaultPrimaryKey: {
            type: "INT UNSIGNED",
            modifier: "AUTO_INCREMENT PRIMARY KEY"
        }
    };

    protected primitiveType(type: Type<any,any>, modifier: boolean = true): string{
        let result = "";

        if(type instanceof IntegerType){
            result += this.integerType(type, modifier);
        }else if(type instanceof StringType){
            result += this.stringType(type, modifier);
        }

        if(modifier && type.hasProperty("primaryKey")){
            result += " PRIMARY KEY";
        }

        return result;
    }

    protected integerType(type: IntegerType, modifier: boolean = true): string{
        let result = "";
        result += " INT";
        if(modifier && type.hasProperty("generated")){
            result += " AUTO_INCREMENT";
        }
        return result;
    }

    protected stringType(type: StringType, modifier: boolean = true): string{
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
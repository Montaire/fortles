import { StringType, TypeConnector } from "@fortles/model";

export default class StringMySqlTypeConnector extends TypeConnector<StringType, string, string>{
    
    override exportData(value: string): string {
        return value;
    }
    override importData(value: string): string {
        return value;
    }
    override exportDefiniton(): string {
        let config = this.type.getConfig();
        let definition = "";

        if(config.length < 255){
            if(config.fixed){
                definition += "VARCHAR";
            }else{
                definition += "CHAR";
            }
        }else{
            definition += "TEXT";
        }

        if(config.length){
            definition += "(" + config.length + ")";
        }

        return definition;
    }
    override importDefinition(definition: string): StringType {
        throw new Error("Method not implemented.");
    }

}
import { IntegerType, TypeAdapter } from "@fortles/model";

export class IntegerMySqlTypeAdapter extends TypeAdapter<IntegerType, number, number, string>{
    override exportData(value: number): number {
        return value;
    }
    override importData(value: number): number {
        return value;
    }
    override exportSchema(): string {
        let config = this.type.getConfig();
        let definition = "";
        if(config.unsigned){
            definition += "UNSIGNED ";
        }
        if(!config.bytes){
            definition += "INT";
        }else if(config.bytes <= 4){
            switch(config.bytes){
                case 1:
                    definition += "TINYINT";
                    break;
                case 2:
                    definition += "SMALLINT";
                    break;
                case 3:
                    definition += "MEDIUMINT";
                    break;
                case 4:
                    definition += "INT";
                    break;
            }
        }else if(config.bytes <= 8){
            definition += "BIGINT";
        }else{
            throw new Error(config.bytes + " bytes not supported for '" + this.type.getName()) + "'";
        }
        return definition;
    }
    override importSchema(definition: string): IntegerType {
        throw new Error("Method not implemented.");
    }

}
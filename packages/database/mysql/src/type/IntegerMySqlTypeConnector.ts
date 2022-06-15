import { IntegerType, TypeConnector } from "@fortles/model";

export default class IntegerMySqlTypeConnector extends TypeConnector<IntegerType, number>{
    override exportData(value: number) {
        throw new Error("Method not implemented.");
    }
    override importData(): number {
        throw new Error("Method not implemented.");
    }
    override exportDefiniton(): string {
        let config = this.type.getConfig();
        if(config.unsigned){
            if(config.max){
                if(config.max <= 255){
                    return "UNSIGNED TINYINT";
                }else if(config.max <= 65535){
                    return "UNSIGNED SMALLINT"
                }else if(config.max <= 16777215n){

                }
            }else{
                return "UNSIGNED INT";
            }
        }
    }
    override importDefinition(): IntegerType {
        throw new Error("Method not implemented.");
    }

}
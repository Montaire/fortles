import { IntegerType, TypeConnector } from "@fortles/model";

export default class IntegerMySqlTypeConnector extends TypeConnector<IntegerType, number>{
    override exportData(value: number) {
        throw new Error("Method not implemented.");
    }
    override importData(): number {
        throw new Error("Method not implemented.");
    }
    override exportDefiniton(): string {
        throw new Error("Method not implemented.");
    }
    override importDefinition(): IntegerType {
        throw new Error("Method not implemented.");
    }

}
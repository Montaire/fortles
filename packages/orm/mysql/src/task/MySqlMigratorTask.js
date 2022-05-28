import { IntegerType, StringType } from "@fortles/model";
export default class MySqlMigratorTask {
    config = {
        charLength: 255,
        encoding: "utf-8",
        defaultPrimaryKey: {
            type: "INT UNSIGNED",
            modifier: "AUTO_INCREMENT PRIMARY KEY"
        }
    };
    primitiveType(type, modifier = true) {
        let result = "";
        if (type instanceof IntegerType) {
            result += this.integerType(type, modifier);
        }
        else if (type instanceof StringType) {
            result += this.stringType(type, modifier);
        }
        if (modifier && type.hasProperty("primaryKey")) {
            result += " PRIMARY KEY";
        }
        return result;
    }
    integerType(type, modifier = true) {
        let result = "";
        result += " INT";
        if (modifier && type.hasProperty("generated")) {
            result += " AUTO_INCREMENT";
        }
        return result;
    }
    stringType(type, modifier = true) {
        let result = "";
        let length = type.getConfig().length ?? 80;
        if (!length || length < this.config.charLength) {
            result += type.getConfig().fixed ? " CHAR" : " VARCHAR";
        }
        else {
            result += " TEXT";
        }
        if (length) {
            result += "(" + length + ")";
        }
        return result;
    }
}
//# sourceMappingURL=MySqlMigratorTask.js.map
import { IntegerType, StringType, Type } from "@fortles/model";
import { MySqlMigratorConfig } from "../MySqlMigrator";
export default abstract class MySqlMigratorTask {
    protected config: MySqlMigratorConfig;
    protected primitiveType(type: Type<any, any>, modifier?: boolean): string;
    protected integerType(type: IntegerType, modifier?: boolean): string;
    protected stringType(type: StringType, modifier?: boolean): string;
}

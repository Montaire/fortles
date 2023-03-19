import { date, Entity, primaryKey, string } from "../../index.js";

export default class DatabseVersion extends Entity{
    @primaryKey
    @string()
    version: string = "1";

    @string()
    name?: string;

    @date()
    date?: Date;
}
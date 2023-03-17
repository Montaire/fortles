import { date, Entity, primaryKey, string } from "../../index.js";

export default class DatabseVersion extends Entity{
    @primaryKey
    @string()
    version?: string;

    @string()
    name?: string;

    @date()
    date?: Date;
}
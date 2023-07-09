import { date, Entity, model, primaryKey, string } from "../../index.js";

@model
export default class DatabseVersion extends Entity{
    @primaryKey
    @string()
    version: string = "1";

    @string()
    name?: string;

    @date()
    date?: Date;
}
import { Entity, hasMany, model, string } from "../../src/index.js";
import { TestUser } from "./index.js";

@model
export class TestGroup extends Entity{
    @string()
    name!: string;

    @hasMany(() => TestUser)
    users?: TestUser[];
}
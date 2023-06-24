import { Entity, hasMany, string } from "../../src/index.js";
import { TestUser } from "./index.js";

export class TestGroup extends Entity{
    @string()
    name!: string;

    @hasMany(() => TestUser)
    users?: TestUser[];
}
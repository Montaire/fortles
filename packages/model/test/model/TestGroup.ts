import { Entity, hasMany, string } from "../../src/index.js";

export class TestGroup extends Entity{
    @string()
    name: string;
}
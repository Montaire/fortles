import { Entity, hasMany } from "../../src/index.js";
import { TestUser } from "./index.js";

export class TestGroup extends Entity{
    @hasMany(TestUser)
    users: TestUser[];
}
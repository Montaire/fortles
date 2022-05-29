import { Entity, hasMany } from "../../src/index.js";
import TestUser from "./TestUser.js";

export default class TestGroup extends Entity{
    @hasMany(TestUser)
    users: TestUser[];
}
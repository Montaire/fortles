import { Entity, primaryKey, generated, uuid, email, withMany, string } from "../../src/index.js";
import { TestGroup } from "./index.js";

/**
 * Test users goal is to simulate all possible connection types.
 */
export class TestUser extends Entity{
    //Redefining the primaray key with an auto generated uuid
    @primaryKey
    @generated
    @uuid()
    readonly id: Readonly<string>;

    @email()
    email: string;

    @withMany(() => TestGroup)
    groups: TestGroup[];

    @string()
    name: string;
}
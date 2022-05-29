import { Entity, primaryKey, generated, uuid, email, withMany } from "../../src/index.js";
import TestGroup from "./TestGroup.js";

/**
 * Test users goal is to simulate all possible connection types.
 */
export default class TestUser extends Entity{

    @primaryKey
    @generated
    @uuid()
    id: Readonly<string>;

    @email()
    email: string;

    @withMany(TestGroup)
    groups: TestGroup[];
}
import { Entity, uuid, generated, primaryKey, email, hasMany, withMany } from "@fortles/model";
import Group from "./Group.js";


export default class User extends Entity{

    @primaryKey
    @generated
    @uuid()
    id?: Readonly<string>;

    @email()
    email?: string;

    @withMany(() => Group)
    groups?: Group[];
}
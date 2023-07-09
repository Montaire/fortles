import { Entity, uuid, generated, primaryKey, email, hasMany, withMany, model } from "@fortles/model";
import Group from "./Group.js";

@model
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
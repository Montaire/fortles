import { Entity, uuid, generated, primaryKey, email, hasMany } from "@fortles/model";
import Group from "./Group";


export default class User extends Entity{

    @primaryKey
    @generated
    @uuid()
    id: Readonly<string>;

    @email()
    email: string;

    @hasMany(Group)
    groups: Group[];
}
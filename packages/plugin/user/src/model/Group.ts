import { Entity, hasMany } from "@fortles/model";
import User from "./User";

export default class Group extends Entity{
    @hasMany(() => User)
    users: User[];
}
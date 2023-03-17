import { Entity, hasMany } from "@fortles/model";
import User from "./User.js";

export default class Group extends Entity{
    @hasMany(() => User)
    users?: User[];
}
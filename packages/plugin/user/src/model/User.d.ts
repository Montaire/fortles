import { Entity } from "@fortles/model";
import Group from "./Group";
export default class User extends Entity {
    id: Readonly<string>;
    email: string;
    groups: Group[];
}

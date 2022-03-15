import AddonGroup from "./AddonGroup.js";
import { Application, Middleware } from "./index.js";

export default interface Addon<T extends AddonGroup = AddonGroup>{
    prepare(application: Application): void;
}
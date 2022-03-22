import { Application } from "./index.js";

export default interface Addon{
    prepareAddon(application: Application): void;
}
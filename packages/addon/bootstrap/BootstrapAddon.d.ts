import { Addon, Application } from "@fortles/core";
export default class BootstrapAddon implements Addon {
    prepare(application: Application): Promise<void>;
}

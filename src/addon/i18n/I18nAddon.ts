import { Addon, Application } from "@fortles/core";

export default class I18nAddon implements Addon{
    public prepareAddon(application: Application): void {
        throw new Error("Method not implemented.");
    }
    
}
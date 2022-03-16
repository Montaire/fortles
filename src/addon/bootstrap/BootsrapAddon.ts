import { Addon, Application } from "@fortles/core";

export default class BootsrapAddon implements Addon{
    async prepare(application: Application): Promise<void> {
        console.log(await import.meta.resolve("bootstrap"));
        application.addStyleAsset("bootsrap.min.js", await import.meta.resolve("bootstrap"));
    }

}
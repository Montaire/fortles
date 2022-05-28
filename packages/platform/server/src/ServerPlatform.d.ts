import { Application } from "@fortles/core";
import { Platform } from "@fortles/core";
export default class ServerPlatform extends Platform {
    port: number;
    protected templatePaths: string[];
    /**
     * Port of the server
     * @param port
     */
    constructor(port: number, templatePaths: string[]);
    prepare(application: Application): void;
    run(application: Application): void;
}

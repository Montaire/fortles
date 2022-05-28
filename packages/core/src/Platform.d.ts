import { Application } from "./index.js";
export default abstract class Platform {
    /**
     * Override this in the paltform
     * @param application
     */
    abstract run(application: Application): void;
    abstract prepare(application: Application): void;
}

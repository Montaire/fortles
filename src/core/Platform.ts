import { Application } from "./index.js";

export default abstract class Platform{
    /**
     * Override this in the paltform
     * @param application 
     */
    public abstract run(application: Application): void

    public abstract prepare(application: Application): void
}
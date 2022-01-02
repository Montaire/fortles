import { Application, Middleware } from "./index.js";

export default abstract class Addon{
    public getMiddlewares(): Middleware[]{
        return [];
    }
    public abstract prepare(application: Application): void;
}
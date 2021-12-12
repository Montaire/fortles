import { Application, Middleware } from "essentials-framework";

export default abstract class Addon{
    public getMiddlewares(): Middleware[]{
        return [];
    }
    public abstract prepare(application: Application): void;
}
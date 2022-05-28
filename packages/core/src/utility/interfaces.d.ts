import { Application, RenderEngine, Request, Response } from "../index.js";
export interface Cloneable {
    clone(): this;
}
export interface Comperable {
    compare(other: this): boolean;
}
export interface Renderable {
    render(engine: RenderEngine, request: Request, response: Response): void;
}
export interface Registrable {
    prepare(applcation: Application): void;
}

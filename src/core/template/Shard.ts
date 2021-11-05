import { Request, Response } from "../index.js";
import { RenderEngine } from "../render/index.js";

export default interface Shard{
    render(engine: RenderEngine, request: Request, response: Response): void;
}
import { Request, Response } from "../../../";
import RenderEngine from "../render/RenderEngine";

export default interface Shard{
    render(engine: RenderEngine, request: Request, response: Response): void;
}
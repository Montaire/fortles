import { RenderEngine, Request, Response } from "../core/index.js";

export default class TestRenderEngine extends RenderEngine{
    constructor(){
        super(null);
    }
    public dispatch(request: Request, response: Response): void {
        
    }

}
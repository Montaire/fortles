import { RenderEngine, Request, Response } from "@fortles/core";

export default class TestRenderEngine extends RenderEngine{
    constructor(){
        super(null);
    }
    public dispatch(request: Request, response: Response): void {
        
    }

}
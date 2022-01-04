import { RenderEngine, Request, Response } from "../..";

export default class TestRenderEngine extends RenderEngine{
    constructor(){
        super(null);
    }
    public dispatch(request: Request, response: Response): void {
        
    }

}
import { RenderEngine, Request, Response } from "@fortles/core";
export default class SitemapRenderEngine extends RenderEngine {
    dispatch(request: Request, response: Response): void;
    protected render(url: String, response: Response): void;
    beforeDispatch(request: Request, response: Response): void;
    afterDispatch(request: Request, response: Response): void;
}

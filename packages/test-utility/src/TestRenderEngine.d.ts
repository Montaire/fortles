import { Asset, TemplateRenderEngine, Request, Response, Template } from "@fortles/core";
export default class TestRenderEngine extends TemplateRenderEngine {
    addAssetToContent(asset: Asset): void;
    dispatch(request: Request, response: Response): void;
    setTemplate(template: Template): void;
}

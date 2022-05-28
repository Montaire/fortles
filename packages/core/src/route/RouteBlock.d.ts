import { Controller, Comperable, Renderable, TemplateRenderEngine, Request, Response } from "../index.js";
/**
 * A Block is an interchangeble element on the view.
 */
export default class RouteBlock implements Comperable, Renderable {
    private templateName;
    private controller;
    /**
     * Creates a new block.
     * @param controller for the block
     * @param template to render the data.
     */
    constructor(controller: Controller, template: string);
    compare(other: this): boolean;
    getTemplate(): string;
    getController(): Controller;
    render(engine: TemplateRenderEngine, request: Request, response: Response): void;
}

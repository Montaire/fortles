import { Response, Controller } from "./index.js";
export default class ChildResponse extends Response {
    protected parent: Response;
    constructor(controller: Controller, parent: Response);
    write(content: string): void;
    close(): void;
    getParent(): Response;
}

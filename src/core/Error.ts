import { TemplateShard } from "../core/template";

export class NotFoundError extends Error{
    code = 404;
}

export class InvalidTemplateError extends Error{
    constructor(message: string, shard: TemplateShard){
        super(message);
    }
    code = 500;
}
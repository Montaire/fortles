import { TemplateShard } from "../core/template/index.js";

export class NotFoundError extends Error{
    code = 404;
}

export class InvalidTemplateError extends Error{
    constructor(message: string, shard: TemplateShard){
        super(message);
    }
    code = 500;
}
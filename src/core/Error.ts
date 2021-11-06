import { TemplateShard } from "../core/template/index.js";
import * as Path from "path";
import { CharacterStreamReader } from "./utility/index.js";

class HttpError extends Error{
    protected code: number;
}

export class NotFoundError extends HttpError{
    code = 404;
}

export class InvalidTemplateError extends HttpError{
    constructor(message: string, reader: CharacterStreamReader){
        super(message);
        this.file = Path.resolve(reader.getPath()) + ":" + reader.getLine();
    }
    code = 500;
    file: string;
}
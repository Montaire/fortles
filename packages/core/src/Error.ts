import { CharacterStreamReader } from "./index.js";

export class HttpError extends Error{
    protected code: number;

    public getCode(): number{
        return this.code;
    }

    public getMessage(): string{
        return this.message;
    }
}

export class NotFoundError extends HttpError{
    code = 404;
}

export class InternalServerError extends HttpError{
    code = 500;
}

export class RuntimeError extends Error{

}

export class InvalidTemplateError extends InternalServerError{
    constructor(message: string, reader: CharacterStreamReader){
        super(message);
        this.file = reader.getCursorPath();
    }
    file: string;
}
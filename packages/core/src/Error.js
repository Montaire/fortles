export class HttpError extends Error {
    code;
    getCode() {
        return this.code;
    }
    getMessage() {
        return this.message;
    }
}
export class NotFoundError extends HttpError {
    code = 404;
}
export class InternalServerError extends HttpError {
    code = 500;
}
export class RuntimeError extends Error {
}
export class InvalidTemplateError extends InternalServerError {
    constructor(message, reader) {
        super(message);
        this.file = reader.getCursorPath();
    }
    file;
}
//# sourceMappingURL=Error.js.map
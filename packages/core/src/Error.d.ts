import { CharacterStreamReader } from "./index.js";
export declare class HttpError extends Error {
    protected code: number;
    getCode(): number;
    getMessage(): string;
}
export declare class NotFoundError extends HttpError {
    code: number;
}
export declare class InternalServerError extends HttpError {
    code: number;
}
export declare class RuntimeError extends Error {
}
export declare class InvalidTemplateError extends InternalServerError {
    constructor(message: string, reader: CharacterStreamReader);
    file: string;
}

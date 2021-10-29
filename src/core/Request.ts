export default abstract class Request{

  
    abstract getType(): RequestType;
    abstract getMime(): string;
    abstract getPath(): string;
}

export const enum RequestType{
    FULL,
    PARTIAL,
    ACTION
}
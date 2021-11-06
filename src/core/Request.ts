export default abstract class Request{

  
    public abstract getType(): RequestType;
    public abstract getMime(): string;
    public abstract getPath(): string;
}

export const enum RequestType{
    FULL,
    PARTIAL,
    ACTION
}
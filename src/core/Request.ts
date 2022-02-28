import { Locale } from "./localization";

export default abstract class Request{

  
    public abstract getType(): RequestType;
    public abstract getMime(): string;
    public abstract getPath(): string;
    public abstract getLocale(): Locale;
}

export const enum RequestType{
    FULL,
    PARTIAL,
    ACTION
}
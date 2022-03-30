import { Locale } from "./localization";

export default abstract class Request{

  
    public abstract getType(): RequestType;
    public abstract getMime(): string;
    public abstract getPath(): string;
    public abstract getLocale(): Locale;
    public abstract getReferer(): string;
    public abstract getBlockPath(): string;
}

export class DummyRequest extends Request{
    
    path: string;
    
    constructor(path: string){
        super();
        this.path = path;
    }
    
    public getType(): RequestType {
        return null;
    }
    public getMime(): string {
        return null;
    }
    public getPath(): string {
        return this.path;
    }
    public getLocale(): Locale {
        return null;
    }
    public getReferer(): string {
        return null;
    }
    public getBlockPath(): string {
        throw new Error("Method not implemented.");
    }
}

export const enum RequestType{
    FULL,
    PARTIAL,
    ACTION
}
import { Locale } from "./localization";
import { Cloneable } from "./utility";

export default abstract class Request implements Cloneable{
    public abstract getType(): RequestType;
    public abstract getMime(): string;
    public abstract getPath(): string;
    public abstract getLocale(): Locale;
    public abstract getReferer(): string;
    public abstract getBlockPath(): string;
    public abstract clone(): this;
}

export class DummyRequest extends Request {
    
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
    public clone(): this {
        return this;
    }
}

export const enum RequestType{
    FULL,
    PARTIAL,
    ACTION
}
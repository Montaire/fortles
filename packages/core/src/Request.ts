import { Locale } from "./localization/index.js";
import { Cloneable } from "./utility/index.js";

export default abstract class Request implements Cloneable{
    public abstract getType(): RequestType;
    public abstract getMime(): string;
    public abstract getPath(): string|null;
    public abstract getLocale(): Locale|null;
    public abstract getReferer(): string|null;
    public abstract getBlockPath(): string;
    public abstract clone(): this;
}

export class DummyRequest extends Request {
    
    path: string | null;
    
    constructor(path: string|null){
        super();
        this.path = path;
    }
    
    public getType(): RequestType {
        return RequestType.FULL;
    }
    public getMime(): string {
        return 'application/text';
    }
    public getPath(): string|null {
        return this.path;
    }
    public getLocale(): Locale|null{
        return null;
    }
    public getReferer(): string|null {
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
    /** Full view */
    FULL,
    /** Get the partial update for the view */
    PARTIAL,
    ACTION,
    /** View requests only a block */
    BLOCK
}
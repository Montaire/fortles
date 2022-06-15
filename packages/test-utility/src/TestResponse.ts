import { Controller, Response } from "@fortles/core";

export default class TestResponse extends Response{

    public body = '';
    public target: string = null;
    public blockPath: string = null;

    constructor(controller = new Controller()){
        super(controller);
    }

    write(content: any): void {
        this.body += content;
    }

    close(): void {
        
    }

    public override toString(){
        return this.body;
    }

    public getBody(){
        return this.body;
    }

    public override setBlockPath(path: string): void {
        this.blockPath = path;
    }
}
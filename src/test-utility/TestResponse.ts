import { Controller, Response } from "@fortles/core";

export default class TestResponse extends Response{

    protected body = '';

    constructor(controller = new Controller()){
        super(controller);
    }

    write(content: any): void {
        this.body += content;
    }

    close(): void {
        
    }

    public toString(){
        return this.body;
    }

    public getBody(){
        return this.body;
    }

}
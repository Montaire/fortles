import Controller from "../../Controller.js";
import { Response } from "../../index.js";

export default class TestResponse extends Response{

    protected content = '';

    constructor(controller = new Controller()){
        super(controller);
    }

    write(content: any): void {
        this.content += content;
    }

    close(): void {
        
    }

    public toString(){
        return this.content;
    }

}
import { Response, Controller } from "../../";

export default class ChildResponse extends Response{

    protected parent: Response;

    constructor(controller: Controller, parent: Response){
        super(controller);
        if(parent instanceof ChildResponse){
            this.parent = parent.getParent();
        }else{
            this.parent = parent;
        }
    }

    write(content: string): void {
        this.parent.write(content);
    }

    close(): void {
        this.parent.close();
    }

    getParent(): Response{
        return this.parent;
    }
}
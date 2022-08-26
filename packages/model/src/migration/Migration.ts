import { ModelChange } from "../index.js";

export class Migration{

    protected changes: ModelChange[];

    constructor(changes: ModelChange[]){
        this.changes = changes;
    }

    public up(){

    }

    public down(){

    }

    public change(){

    }

    public getChanges(): ModelChange[]{
        return this.changes;
    }
}
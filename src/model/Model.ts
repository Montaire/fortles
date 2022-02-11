import { Entity } from "./index.js";

class Model<T extends Entity>{
    
    constructor(){
         
    }

    public save(entity: T){

    }

    public delete(){

    }

    public get(): T{
        return null;
    }
}
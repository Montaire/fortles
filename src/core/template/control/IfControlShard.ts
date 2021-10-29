import {ControlShard} from "../index.js";

export default class IfControlShard /*extends ControlShard*/{
    constructor(reader, parent){
        super(reader, parent, "if");
    }

    render(engine, request, response){
        
        throw Error('Not implemented');        
    }
}
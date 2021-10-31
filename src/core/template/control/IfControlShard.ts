import CharacterStreamReader from "essentials/src/utility/CharacterStreamReader";
import {ControlShard, TemplateShard} from "../index.js";

export default class IfControlShard extends ControlShard{
    constructor(reader : CharacterStreamReader, parent: TemplateShard){
        super(reader, parent, "if");
    }

    render(engine, request, response){
        
        throw Error('Not implemented');        
    }
}
import CharacterStreamReader from "essentials/src/utility/CharacterStreamReader";
import {ControlShard, TemplateShard} from "../index.js";

export default class InputControlShard extends ControlShard {
    constructor(reader: CharacterStreamReader, parent: TemplateShard){
        super(reader, parent, "input");
    }
}
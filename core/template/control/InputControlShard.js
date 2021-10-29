import {ControlShard} from "../index.js";

export default class InputControlShard extends ControlShard {
    constructor(reader, parent){
        super(reader, parent, "input");
    }
}
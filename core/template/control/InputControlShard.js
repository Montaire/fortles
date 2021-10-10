const ControlShard = require("essentials/core/template/control/ControlShard");

class InputControlShard extends ControlShard {
    constructor(reader, parent){
        super(reader, parent, "input");
    }
}

module.exports = InputControlShard;
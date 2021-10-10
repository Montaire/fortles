const ControlShard = require("essentials/core/template/control/ControlShard");

class IfControlShard extends ControlShard{
    constructor(reader, parent){
        super(reader, parent, "if");
    }

    render(engine, request, response){
        
        throw Error('Not implemented');        
    }
}
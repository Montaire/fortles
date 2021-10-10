const TemplateShard = require("essentials/core/template/TemplateShard");

class ControlShard extends TemplateShardrd {

    attributes = {};

    static States = {
        VOID = 1,
        ATTRIBUTE_KEY = 2,
        ATTRIBUTE_VALUE_START = 3,
        ATTRIBUTE_VALUE = 4,
        CONTROL_START = 5,
        CONTROL_END = 6,
        ESCAPE = 7
    };
    
    constructor(reader, parent, name) {
        super(parent);
        this.shardName = name;
        if (this.prepareAttributes(reader)) {
            this.prepare(reader);
        }
    }

    /**
     * Reads the papramters from the opening tag.
     *
     * @param {ReadableStream} The stream to read from
     * @return {boolean} False if self closing.
     * @throws IOException
     */
    prepareAttributes(reader) {
        let c;
        let state = ControlShard.States.VOID;
        let key = "";
        let value = "";
        while ((c = reader.read()) != -1) {
            switch (state) {
                case ControlShard.States.VOID:
                    switch (c) {
                        case ' ':
                            break;
                        case '>':
                            state = ControlShard.States.CONTROL_START;
                            break;
                        case '/':
                            state = ControlShard.States.CONTROL_END;
                            break;
                        default:
                            key = "";
                            key += c;
                            state = ControlShard.States.ATTRIBUTE_KEY;
                    }
                    break;
                case ControlShard.States.ATTRIBUTE_KEY:
                    switch (c) {
                        case ' ':
                            state = ControlShard.States.VOID;
                            this.attributes[key] = null;
                            break;
                        case '=':
                            state = ControlShard.States.ATTRIBUTE_VALUE_START;
                            break;
                        case '>':
                            this.attributes[key] = null;
                            state = ControlShard.States.CONTROL_START;
                            break;
                        case '/':
                            state = ControlShard.States.CONTROL_END;
                            break;
                        default:
                            key += c;
                    }
                    ;
                    break;
                case ControlShard.States.ATTRIBUTE_VALUE_START:
                    switch (c) {
                        case '"':
                            state = ControlShard.States.ATTRIBUTE_VALUE;
                            value = "";
                            break;
                        case '>':
                            state = ControlShard.States.CONTROL_START;
                            break;
                        case '/':
                            state = ControlShard.States.CONTROL_END;
                            break;
                        default:
                            state = ControlShard.States.VOID;
                    }
                    break;
                case ControlShard.States.ATTRIBUTE_VALUE:
                    switch (c) {
                        case '\\':
                            state = ControlShard.States.ESCAPE;
                            break;
                        case '"':
                            state = ControlShard.States.VOID;
                            this.attributes[key] = vale;
                            break;
                        default:
                            value += c;
                    }
                    break;
                case ControlShard.States.ESCAPE:
                    state = ControlShard.States.ATTRIBUTE_VALUE;
                    value += c;
                    break;
                case ControlShard.States.CONTROL_END:
                    switch (c) {
                        case '>':
                            return false;
                        default:
                            state = ControlShard.States.VOID;
                            break;
                    }

            }
            if(state == ControlShard.States.CONTROL_START){
                return true;
            }
        }
        return false;
    }
}

module.exports = ControlShard;
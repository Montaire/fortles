import { TemplateShard } from "../index.js";
export default class ControlShard extends TemplateShard {
    attributes = new Map();
    processAttributes = [];
    rawAttributes = "";
    constructor(reader, parent, cursorPosition) {
        super(parent);
        this.shardName = this.getName();
        switch (cursorPosition) {
            case 1 /* ControlShardCursorPosition.INSIDE */:
                this.prepare(reader);
                break;
            case 0 /* ControlShardCursorPosition.ATTRIBUTES */:
                if (this.prepareAttributes(reader)) {
                    this.prepare(reader);
                }
                break;
            case 2 /* ControlShardCursorPosition.ENDED */:
                break;
        }
    }
    /**
     * Reads the papramters from the opening tag.
     *
     * @param reader The stream to read from
     * @return False if self closing.
     */
    prepareAttributes(reader) {
        let c;
        let state = 0 /* ControlShardStates.VOID */;
        let key = "";
        let value = "";
        let isSingleQuote = true;
        while ((c = reader.read()) !== null) {
            switch (state) {
                case 0 /* ControlShardStates.VOID */:
                    switch (c) {
                        case ' ':
                            break;
                        case '>':
                            state = 4 /* ControlShardStates.CONTROL_START */;
                            break;
                        case '/':
                            state = 5 /* ControlShardStates.CONTROL_END */;
                            break;
                        default:
                            key = "";
                            key += c;
                            state = 1 /* ControlShardStates.ATTRIBUTE_KEY */;
                    }
                    break;
                case 1 /* ControlShardStates.ATTRIBUTE_KEY */:
                    switch (c) {
                        case ' ':
                            state = 0 /* ControlShardStates.VOID */;
                            this.attributes.set(key, null);
                            break;
                        case '=':
                            state = 2 /* ControlShardStates.ATTRIBUTE_VALUE_START */;
                            break;
                        case '>':
                            this.attributes.set(key, null);
                            state = 4 /* ControlShardStates.CONTROL_START */;
                            break;
                        case '/':
                            state = 5 /* ControlShardStates.CONTROL_END */;
                            break;
                        default:
                            key += c;
                    }
                    ;
                    break;
                case 2 /* ControlShardStates.ATTRIBUTE_VALUE_START */:
                    switch (c) {
                        case '"':
                            state = 3 /* ControlShardStates.ATTRIBUTE_VALUE */;
                            isSingleQuote = false;
                            value = "";
                            break;
                        case "'":
                            state = 3 /* ControlShardStates.ATTRIBUTE_VALUE */;
                            isSingleQuote = true;
                            value = "";
                            break;
                        case '>':
                            state = 4 /* ControlShardStates.CONTROL_START */;
                            break;
                        case '/':
                            state = 5 /* ControlShardStates.CONTROL_END */;
                            break;
                        default:
                            state = 0 /* ControlShardStates.VOID */;
                    }
                    break;
                case 3 /* ControlShardStates.ATTRIBUTE_VALUE */:
                    switch (c) {
                        case '\\':
                            state = 6 /* ControlShardStates.ESCAPE */;
                            break;
                        case '"':
                            if (!isSingleQuote) {
                                state = 0 /* ControlShardStates.VOID */;
                                this.setAttribute(key, value, isSingleQuote);
                            }
                            else {
                                value += c;
                            }
                            break;
                        case "'":
                            if (isSingleQuote) {
                                state = 0 /* ControlShardStates.VOID */;
                                this.setAttribute(key, value, isSingleQuote);
                            }
                            else {
                                value += c;
                            }
                            break;
                        default:
                            value += c;
                            break;
                    }
                    break;
                case 6 /* ControlShardStates.ESCAPE */:
                    state = 3 /* ControlShardStates.ATTRIBUTE_VALUE */;
                    value += c;
                    break;
                case 5 /* ControlShardStates.CONTROL_END */:
                    switch (c) {
                        case '>':
                            return false;
                        default:
                            state = 0 /* ControlShardStates.VOID */;
                            break;
                    }
            }
            if (state == 4 /* ControlShardStates.CONTROL_START */) {
                return true;
            }
        }
        return false;
    }
    setAttribute(name, value = null, isSingleQuote) {
        if (!this.processAttributes.length || this.processAttributes.includes(name)) {
            this.attributes.set(name, value);
        }
        else {
            let quote = isSingleQuote ? "'" : '"';
            this.rawAttributes += name + "=" + quote + value + quote;
        }
    }
}
//# sourceMappingURL=ControlShard.js.map
import { getSystemErrorName } from "util";
import { CharacterStreamReader } from "../../utility/index.js";
import { TemplateShard } from "../index.js";

export const enum ControlShardStates{
    VOID,
    ATTRIBUTE_KEY,
    ATTRIBUTE_VALUE_START,
    ATTRIBUTE_VALUE,
    CONTROL_START,
    CONTROL_END,
    ESCAPE
}

export const enum ControlShardCursorPosition{
    ATTRIBUTES,
    INSIDE,
    ENDED,
}

export default abstract class ControlShard extends TemplateShard {

    protected attributes = new Map<string, string>();

    protected processAttributes: string[] = [];

    protected rawAttributes = "";
    
    constructor(reader: CharacterStreamReader, parent: TemplateShard, cursorPosition: ControlShardCursorPosition) {
        super(parent);
        this.shardName = this.getName();
        switch(cursorPosition){
            case ControlShardCursorPosition.INSIDE:
                this.prepare(reader);
                break;
            case ControlShardCursorPosition.ATTRIBUTES:
                if (this.prepareAttributes(reader)) {
                    this.prepare(reader);
                }
                break;
            case ControlShardCursorPosition.ENDED:
                break;
        }
    }

    public abstract initialize(reader: CharacterStreamReader): void;

    public abstract  getName(): string;

    /**
     * Reads the papramters from the opening tag.
     *
     * @param reader The stream to read from
     * @return False if self closing.
     */
    prepareAttributes(reader: CharacterStreamReader): boolean {
        let c: string;
        let state = ControlShardStates.VOID;
        let key = "";
        let value = "";
        let isSingleQuote = true;
        while ((c = reader.read()) !== null) {
            switch (state) {
                case ControlShardStates.VOID:
                    switch (c) {
                        case ' ':
                            break;
                        case '>':
                            state = ControlShardStates.CONTROL_START;
                            break;
                        case '/':
                            state = ControlShardStates.CONTROL_END;
                            break;
                        default:
                            key = "";
                            key += c;
                            state = ControlShardStates.ATTRIBUTE_KEY;
                    }
                    break;
                case ControlShardStates.ATTRIBUTE_KEY:
                    switch (c) {
                        case ' ':
                            state = ControlShardStates.VOID;
                            this.attributes.set(key, null);
                            break;
                        case '=':
                            state = ControlShardStates.ATTRIBUTE_VALUE_START;
                            break;
                        case '>':
                            this.attributes.set(key, null);
                            state = ControlShardStates.CONTROL_START;
                            break;
                        case '/':
                            state = ControlShardStates.CONTROL_END;
                            break;
                        default:
                            key += c;
                    }
                    ;
                    break;
                case ControlShardStates.ATTRIBUTE_VALUE_START:
                    switch (c) {
                        case '"':
                            state = ControlShardStates.ATTRIBUTE_VALUE;
                            isSingleQuote = false;
                            value = "";
                            break;
                        case "'":
                            state = ControlShardStates.ATTRIBUTE_VALUE;
                            isSingleQuote = true;
                            value = "";
                            break;
                        case '>':
                            state = ControlShardStates.CONTROL_START;
                            break;
                        case '/':
                            state = ControlShardStates.CONTROL_END;
                            break;
                        default:
                            state = ControlShardStates.VOID;
                    }
                    break;
                case ControlShardStates.ATTRIBUTE_VALUE:
                    switch (c) {
                        case '\\':
                            state = ControlShardStates.ESCAPE;
                            break;
                        case '"':
                            if(!isSingleQuote){
                                state = ControlShardStates.VOID;
                                this.setAttribute(key, value, isSingleQuote);
                            }else{
                                value += c;
                            }
                            break;
                        case "'":
                            if(isSingleQuote){
                                state = ControlShardStates.VOID;
                                this.setAttribute(key, value, isSingleQuote);
                            }else{
                                value += c;
                            }
                            break;
                        default:
                            value += c;
                            break;
                    }
                    break;
                case ControlShardStates.ESCAPE:
                    state = ControlShardStates.ATTRIBUTE_VALUE;
                    value += c;
                    break;
                case ControlShardStates.CONTROL_END:
                    switch (c) {
                        case '>':
                            return false;
                        default:
                            state = ControlShardStates.VOID;
                            break;
                    }

            }
            if(state == ControlShardStates.CONTROL_START){
                return true;
            }
        }
        return false;
    }

    protected setAttribute(name: string, value: string = null, isSingleQuote: boolean){
        if(!this.processAttributes.length || this.processAttributes.includes(name)){
            this.attributes.set(name, value);
        }else{
            let quote = isSingleQuote ? "'" : '"';
            this.rawAttributes += name + "=" + quote + value + quote;
        }
    }
}
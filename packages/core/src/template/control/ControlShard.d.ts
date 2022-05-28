import { CharacterStreamReader } from "../../utility/index.js";
import { TemplateShard } from "../index.js";
export declare const enum ControlShardStates {
    VOID = 0,
    ATTRIBUTE_KEY = 1,
    ATTRIBUTE_VALUE_START = 2,
    ATTRIBUTE_VALUE = 3,
    CONTROL_START = 4,
    CONTROL_END = 5,
    ESCAPE = 6
}
export declare const enum ControlShardCursorPosition {
    ATTRIBUTES = 0,
    INSIDE = 1,
    ENDED = 2
}
export default abstract class ControlShard extends TemplateShard {
    protected attributes: Map<string, string>;
    protected processAttributes: string[];
    protected rawAttributes: string;
    constructor(reader: CharacterStreamReader, parent: TemplateShard, cursorPosition: ControlShardCursorPosition);
    abstract initialize(reader: CharacterStreamReader): void;
    abstract getName(): string;
    /**
     * Reads the papramters from the opening tag.
     *
     * @param reader The stream to read from
     * @return False if self closing.
     */
    prepareAttributes(reader: CharacterStreamReader): boolean;
    protected setAttribute(name: string, value: string, isSingleQuote: boolean): void;
}

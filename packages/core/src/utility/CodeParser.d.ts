import { CharacterStreamReader } from "./index.js";
declare enum CodeParserTypes {
    FUNCTION_DEFINITION = 0,
    FUNCTION_CALL = 1,
    FUNCTION_PARAMETER = 2
}
export default class CodeParser {
    constructor(reader: CharacterStreamReader, flags: CodeParserTypes);
}
export declare class CallParameterParser {
}
export declare class ArrowFunctionParser {
    constructor(reader: CharacterStreamReader);
}
export {};

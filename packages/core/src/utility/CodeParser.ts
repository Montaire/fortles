import { CharacterStreamReader } from "./index.js";

enum CodeParserTypes{
    FUNCTION_DEFINITION,
    FUNCTION_CALL,
    FUNCTION_PARAMETER
}

enum CodeParserState{
    WORD
}

export default class CodeParser{

    constructor(reader: CharacterStreamReader, flags: CodeParserTypes){
        let c: string | null;
        let word = "";
        let state: CodeParserState | null = null;

        while(c = reader.read()){
            switch(c){
                case '(':

            }
        }
    }
}

export class CallParameterParser{

}

export class ArrowFunctionParser{
    constructor(reader: CharacterStreamReader){
        let c: string | null;
        let word = "";
        let state : CodeParserState | null = null;

        while(c = reader.read()){
            
        }
    }
}
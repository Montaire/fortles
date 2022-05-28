var CodeParserTypes;
(function (CodeParserTypes) {
    CodeParserTypes[CodeParserTypes["FUNCTION_DEFINITION"] = 0] = "FUNCTION_DEFINITION";
    CodeParserTypes[CodeParserTypes["FUNCTION_CALL"] = 1] = "FUNCTION_CALL";
    CodeParserTypes[CodeParserTypes["FUNCTION_PARAMETER"] = 2] = "FUNCTION_PARAMETER";
})(CodeParserTypes || (CodeParserTypes = {}));
var CodeParserState;
(function (CodeParserState) {
    CodeParserState[CodeParserState["WORD"] = 0] = "WORD";
})(CodeParserState || (CodeParserState = {}));
export default class CodeParser {
    constructor(reader, flags) {
        let c = null;
        let word = "";
        let state = null;
        while (c = reader.read()) {
            switch (c) {
                case '(':
            }
        }
    }
}
export class CallParameterParser {
}
export class ArrowFunctionParser {
    constructor(reader) {
        let c = null;
        let word = "";
        let state = null;
        while (c = reader.read()) {
        }
    }
}
//# sourceMappingURL=CodeParser.js.map
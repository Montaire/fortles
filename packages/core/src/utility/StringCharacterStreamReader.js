export default class StringCharacterStreamReader {
    text;
    index = 0;
    line = 1;
    cursor = 0;
    constructor(text) {
        this.text = text;
    }
    read() {
        if (this.index < this.text.length) {
            let character = this.text[this.index++];
            if (character == "\n") {
                this.line++;
                this.cursor = 0;
            }
            else {
                this.cursor++;
            }
            return character;
        }
        else {
            return null;
        }
    }
    getCursor() {
        return this.cursor;
    }
    getLine() {
        return this.line;
    }
    getPath() {
        return "string";
    }
    getCursorPath() {
        return `string:${this.line}:${this.cursor}`;
    }
}
//# sourceMappingURL=StringCharacterStreamReader.js.map
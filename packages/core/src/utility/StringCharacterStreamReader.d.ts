import { CharacterStreamReader } from "./index.js";
export default class StringCharacterStreamReader implements CharacterStreamReader {
    protected text: string;
    protected index: number;
    protected line: number;
    protected cursor: number;
    constructor(text: string);
    read(): string;
    getCursor(): number;
    getLine(): number;
    getPath(): string;
    getCursorPath(): string;
}

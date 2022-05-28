/// <reference types="node" />
import { CharacterStreamReader } from "./index.js";
/**
 * Stream To read a file character by caracter
 * @extends Readable
 */
export default class FileCharacterStreamReader implements CharacterStreamReader {
    protected buffer: Buffer;
    protected fd: number;
    protected line: number;
    protected cursor: number;
    protected path: string;
    protected isOpen: boolean;
    constructor(path: string);
    /**
     * Reads the next character of the file.
     * @returns {?string} Character or null if the file ends
     */
    read(): string | null;
    /**
     * Gets the line number.
     * @returns Line number starting from 1.
     */
    getLine(): number;
    getCursor(): number;
    /**
     * Gets the path.
     * @returns The path of the current file.
     */
    getPath(): string;
    getCursorPath(): string;
}

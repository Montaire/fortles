export default interface CharacterStreamReader {
    read(): string | null;
    getLine(): number;
    getPath(): string;
    /**
     * Gets the path with the cursor position.
     */
    getCursorPath(): string;
    getCursor(): number;
}

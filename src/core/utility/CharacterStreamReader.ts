export default interface CharacterStreamReader{
    read(): string | null;
    getLine(): number
    getPath(): string
}
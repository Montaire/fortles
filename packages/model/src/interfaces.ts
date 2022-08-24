export interface Serializable{
    deserialize(): void;
    serialize(): object;
}
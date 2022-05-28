export default abstract class Query<T> implements Iterable<T> {
    abstract [Symbol.iterator](): Iterator<T, any, undefined>;
    abstract where(condition: (item: T) => boolean): this;
    first(condition?: (item: T) => boolean): T;
    abstract orderBy(field: (item: T) => any): this;
}

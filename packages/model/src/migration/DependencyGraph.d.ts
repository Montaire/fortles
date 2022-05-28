export default class DependencyGraph<T> {
    constructor(items: T[]);
    transverseForeward(includeVirtual?: boolean): Generator<T>;
    transverseReverse(includeVirtual?: boolean): Generator<T>;
}

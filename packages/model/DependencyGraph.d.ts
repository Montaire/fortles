import { Entity } from "./index.js";
export default class DependencyGraph {
    constructor(entityTypes: Set<typeof Entity>);
    transverseForeward(includeVirtual?: boolean): Generator<typeof Entity>;
    transverseReverse(includeVirtual?: boolean): Generator<typeof Entity>;
}

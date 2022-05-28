export default class DependencyGraph {
    constructor(items) {
        //Build a transvesible tree
        for (const entityType of items) {
            const checkMap = new Map();
        }
    }
    *transverseForeward(includeVirtual = true) {
        return [];
    }
    *transverseReverse(includeVirtual = true) {
        return [];
    }
}
class DependencyGraphItem {
    item;
    parents;
    childrens;
}
;
//# sourceMappingURL=DependencyGraph.js.map
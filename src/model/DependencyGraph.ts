import { Entity } from "./index.js";

export default class DependencyGraph{
    constructor(entityTypes: Set<typeof Entity>){
        //Build a transvesible tree
        for(const entityType of entityTypes){
            const checkMap = new Map<typeof Entity, DependencyGraphItem>();

        }
    }

    public *transverseForeward(includeVirtual = true): Generator<typeof Entity>{
        return [];
    }

    public *transverseReverse(includeVirtual = true): Generator<typeof Entity>{
        return [];
    }
}

class DependencyGraphItem{
    item: typeof Entity;
    parents: typeof Entity[];
    childrens: typeof Entity[];
};
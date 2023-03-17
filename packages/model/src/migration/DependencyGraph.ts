import { Entity, EntityDescriptor } from "../index.js";

export default class DependencyGraph<T>{
    constructor(items: T[]){
        //Build a transvesible tree
        for(const entityType of items){
            const checkMap = new Map<T, DependencyGraphItem<T>>();
        }
    }

    public *transverseForeward(includeVirtual = true): Generator<T>{
        return [];
    }

    public *transverseReverse(includeVirtual = true): Generator<T>{
        return [];
    }
}

class DependencyGraphItem<T>{
    item?: T;
    parents?: T;
    childrens?: T;
};
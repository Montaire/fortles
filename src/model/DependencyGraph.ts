import { Entity } from "./index.js";

export default class DependencyGraph{
    constructor(entityList: Entity[]){
    
    }

    public foreward(): Entity[]{
        return [];
    }

    public reverse(): Entity[]{
        return [];
    }
}
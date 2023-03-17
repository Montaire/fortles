import { Entity } from "../index.js";

/**
 * Connects an Entity to the given database.
 * Handles how the definition made, and importing and exporting the data as well.
 */
export abstract class EntityConnector<E extends Entity = Entity>{

    protected entityType: new() => E;

    constructor(entityType: new() => E){
        this.entityType = entityType;
    }

    /**
     * Defines how to import a whole entity from the given database.
     * @param data 
     */
    abstract importEntity(data: object): E

    /**
     * Defines how to export a whole entity to the given database.
     * @param entity 
     */
    abstract exportEntity(entity: E): object

    /**
     * Exports how an entity type (table) is defined in the given database.
     */
    abstract exportCreateDefinition(): string

    /**
     * Exports how an entity type with all the records (table) are dropped from the databsae.
     */
    abstract exportDropDefinition(): string

    /**
     * Exports how to alter an entity type (table) without modifing the records inside it.
     * This function does not modify the records.
     * @param old 
     */
    abstract exportAlterDefinition(old: this): string

    public getName(): string{
        return "nyeh";
    }
}
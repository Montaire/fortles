import { Driver, Entity } from "../index.js";

/**
 * Connects an Entity to the given database.
 * Handles how the definition made, and importing and exporting the data as well.
 */
export abstract class EntityAdapter{

    /**
     * Defines how to import a whole entity from the given database.
     * @param data 
     */
    abstract importEntity(data: object): Entity

    /**
     * Defines how to export a whole entity to the given database.
     * @param entity 
     */
    abstract exportEntity(entity: Entity): object

}
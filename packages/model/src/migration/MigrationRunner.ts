import { readdir } from "fs/promises";
import { existsSync } from "fs";
import { Connection, Model, ModelDescriptor, Migration, EntityDescriptor, CreateSchemaChange} from "../index.js";
import DatabseVersion from "./model/DatabaseVersion.js";

export class MigrationRunner{

    protected model: Model;
    protected modelDescriptorSnapshot: ModelDescriptor|null = null;
    protected basePath: string = "./migartion";
    protected databaseVersionMap = new Map<string, DatabseVersion>;

    constructor(model: Model){
        this.model = model;
    }

    async migrate(){
        for(const connection of this.model.getAllGlobalConnections()){
            this.migrateConnection(connection);
        }
    }

    /**
     * Runs the migartions against all the databases in the connection list.
     * @param paths Array of paths
     */
    async migrateConnection(connection: Connection){
        //Get database version
        let databaseVersion = new DatabseVersion();
        try{
            databaseVersion = connection.query(DatabseVersion).first() ?? new DatabseVersion();
        }catch(error){
            //TODO check error
            //If there is no database version for this connection, add to the database.
            const entityDescriptor = EntityDescriptor.create(DatabseVersion, this.model.getModelDescriptor());
            const createSchemaChange = CreateSchemaChange.createFromEntityDescriptor(entityDescriptor);
            createSchemaChange.applyTo(connection);
        }
        //Upgrade database to the latest version
        //TODO: get folders from the model!
        for(const folder of this.model.getModelDescriptor().getSources()){
            for(const file of await readdir(folder)){
                if(databaseVersion && databaseVersion.version && file.startsWith(databaseVersion.version)){
                    //Skip to the current version
                    continue;
                }
                const migration = await import(file) as Migration;
                //Run migration
                migration.applyTo(connection);
            }
        }
    }

    public async migrateConnectionToSnapshot(name: string = ".snapshot-latest"){
        //Detect changes from the last migration
        const path = this.basePath + "/" + name;

        let latestSnapshot = await this.loadSnapshot(path);
        if(!latestSnapshot){
            latestSnapshot = new ModelDescriptor();
        }

        const changesMap = this.model.getModelDescriptor().getChanges(latestSnapshot);

        //Apply changes
        for(const [connectionName, changes] of changesMap.entries()){
            const connection = Model.getConnection(connectionName);
            for(const change of changes){
                change.applyTo(connection);
            }
        }

        this.saveSnapshot(path);
    }

    /**
     * Saves snapshot from the current model descriptor.
     * @param path Save the snapshot to this location.
     */
    public async saveSnapshot(path: string): Promise<void>{
        this.modelDescriptorSnapshot = this.model.getModelDescriptor().clone();
        ModelDescriptor.serialize(this.modelDescriptorSnapshot, path);
    }

    /**
     * Loads a snapshot from a file
     * @param path 
     */
    public async loadSnapshot(path: string): Promise<ModelDescriptor>{
        return ModelDescriptor.deserialize(path);
    }

    public async createBaseSnapshot(): Promise<void>{
        ModelDescriptor.serialize(this.model.getModelDescriptor(), this.basePath + "/.snapshot-base");
    }

    public async createMigrationFromSnapshot(name: string): Promise<void>{
        const baseSnapshot = await this.loadSnapshot(this.basePath + "/.snapshot-base");
        if(!this.modelDescriptorSnapshot){
            return;
        }
        const changesMap = baseSnapshot.getChanges(this.modelDescriptorSnapshot);
        for(const [connectionName, changes] of changesMap){
            const migartion = new Migration(changes);
            const version = this.databaseVersionMap.get(connectionName)?.version ?? 1;
            migartion.save(this.basePath + "/" + connectionName + "/" + version + "_" + name);
            //TODO: Save version to the database.
        }
    }
}
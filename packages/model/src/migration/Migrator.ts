import { opendirSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { Connection, ModelChange, Model, ModelDescriptor, Migration, EntityDescriptor} from "../index.js";
import DatabseVersion from "./model/DatabaseVersion.js";

export class Migartor{

    protected model: Model;
    protected modelDescriptorSnapshot: ModelDescriptor;
    protected basePath: string = "./migartion";

    constructor(model: Model){
        this.model = model;
    }

    /**
     * Runs the migartions against all the databases in the connection list.
     * @param paths Array of paths
     */
    async migrate(toLatest: boolean = false){
        //Get database version
        const databaseVersion = this.model.query(DatabseVersion)?.first();
        if(!databaseVersion){
            //TODO Separate version to all connections.
            //Create database version into the default connection
            const change = new ModelChange(new EntityDescriptor(), EntityDescriptor.create(DatabseVersion));
            this.model.getConnections().get("default").applyChange(change);
        }
        //Upgrade database to the latest version
        //TODO: get folders from the model!
        for(const folder of this.model.getModelDescriptor().getSources()){
            for(const file of readdirSync(folder)){
                if(databaseVersion && databaseVersion.version && file.startsWith(databaseVersion.version)){
                    //Skip to the current version
                    continue;
                }
                const migration = await import(file) as Migration;
                //Run migration
                for(const change of migration.getChanges()){
                    const connection = change.getEntityDescriptor().baseEntityType.getConnection();
                    connection.applyChange(change);
                }
            }
        }
        if(!toLatest){
            return;
        }
        //Detect changes from the last migration
        let latestSnapshot = this.loadSnapshot(".snapshot-latest");
        if(!latestSnapshot){
            latestSnapshot = new ModelDescriptor();
        }
        //const baseSnapshot = this.loadSnapshot(".snapshot-" + databaseVersion.version);

        const changes = this.model.getModelDescriptor().getChanges(latestSnapshot);

        //Apply changes
        for(const change of changes){
            
        }

        this.saveSnapshot(".snapshot-latest");
    }
    /**
     * Saves snapshot from the current model descriptor.
     * @param path Save the snapshot to this location.
     */
    public saveSnapshot(name: string = ".snapshot", basePath: string = this.basePath): void{
        this.modelDescriptorSnapshot = this.model.getModelDescriptor().clone();
        writeFileSync(basePath + "/" + name, JSON.stringify(ModelDescriptor.serialize(this.modelDescriptorSnapshot)));
    }

    /**
     * Loads a snapshot from a file
     * @param path 
     */
    public loadSnapshot(name: string = ".snapshot", basePath: string = this.basePath): ModelDescriptor{
        const rawData = readFileSync(basePath + "/" + name);
        return ModelDescriptor.deserialize(JSON.parse(rawData.toString()));
    }

    /**
     * Creates a new migration from the last snapshot
     * @returns 
     */
    createMigration(): Migration{
        const changes = this.model.getModelDescriptor().getChanges(this.modelDescriptorSnapshot);
        const migration = new Migration(changes);
        return null;
    }
}
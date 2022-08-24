import { readFileSync, writeFileSync } from "fs";
import { Connection, EntityChange, Model, ModelDescriptor } from "../index.js";

export default class Migartor{

    protected model: Model;
    protected modelDescriptorSnapshot: ModelDescriptor ;

    constructor(model: Model){
        this.model = model;
    }

    migrate(path = "./"){
        //Get database version
        

        //Detect changes
        //let changes = this.model.getModelDescriptor().getChanges(oldModelDescriptor);

        let executionPlan = new Map<Connection, EntityChange[]>();
        //Create an execution plan. later.
        for(const connection of this.model.getConnections().values()){
            //Execute the plan
            for(const change of executionPlan.get(connection)){
                
            }
        }
    }
    /**
     * Saves snapshot from the current model descriptor.
     * @param path 
     */
    public saveSnapshot(path: string = "./migration/.snapshot"): void{
        this.modelDescriptorSnapshot = this.model.getModelDescriptor().clone();
        writeFileSync(path, JSON.stringify(ModelDescriptor.serialize(this.modelDescriptorSnapshot)));
    }

    createMigration(){
        
    }
}
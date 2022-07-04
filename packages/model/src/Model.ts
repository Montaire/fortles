import { Connection, ModelDescriptor, Query } from "./index.js";
import * as fs from "fs";
import { EntityChange } from "./entity/EntityChange.js";

export default class Model{

    protected modelDescriptor: ModelDescriptor;
    protected connections: Map<string, Connection>;

    constructor(modelDescriptor: ModelDescriptor, connections = new  Map<string, Connection>()){
        this.modelDescriptor = modelDescriptor;
        this.connections = connections;
    }

    migrate(rootPath = "./"): void{
        //Get current version
        let versionPath = rootPath + "migration/.version";
        let chnagesPath = rootPath + "migration/";
        let result = JSON.parse(fs.readFileSync(versionPath).toString());
        let version = result.version || 0;
        let oldModelDescriptor: ModelDescriptor;
        if(0 < version){
            let rawData = fs.readFileSync(chnagesPath + version + ".json").toString();
            oldModelDescriptor = ModelDescriptor.deserialize(rawData);
        }else{
            oldModelDescriptor = new ModelDescriptor();
        }
        //Detect changes
        let changes = this.modelDescriptor.getChanges(oldModelDescriptor);

        let executionPlan = new Map<Connection, EntityChange[]>();
        //Create an execution plan. later.
        for(const connection of this.connections.values()){
            //Execute the plan
            for(const change of executionPlan.get(connection)){
                
            }
        }

        //Save changes
        version ++;
        fs.writeFileSync(chnagesPath + version + ".json", ModelDescriptor.serialize(this.modelDescriptor));
        fs.writeFileSync(versionPath, JSON.stringify({version: version}));
    }

    query<T>(): Query<T>{
        return null;
    }
}
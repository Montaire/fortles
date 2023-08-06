import { ModelContext } from "./ModelConext.js";
import { Connection, ModelDescriptor, MigrationRunner, Driver } from "./index.js";

declare const modelContext: ModelContext|undefined;

export class Model{

    protected modelDescriptor: ModelDescriptor;
    protected driverMap: Map<string, Driver>;

    constructor(modelDescriptor: ModelDescriptor = new ModelDescriptor(), driverMap = new  Map<string, Driver>()){
        this.modelDescriptor = modelDescriptor;
        this.driverMap = driverMap;
        if(!driverMap.has("default")){
            throw Error("Default connection must be defined.");
        }
    }

    public migrate(): void{
        const migrator = new MigrationRunner(this);
        migrator.migrate();
    }

    public getDriverMap(): Map<string, Driver>{
        return this.driverMap;
    }

    public setDriver(name: string, driver: Driver): void{
        this.driverMap.set(name, driver);
    }

    public static getConnection(name: string = "default"): Connection{
        if(modelContext){
            return modelContext.getConnection(name);
        }else{
            return this.getInstance().createConnection(name);
        }
    }

    public createConnection(name: string = "default"): Connection{
        const driver = this.driverMap.get(name);
        if(!driver){
            throw new Error("Database driver for \"" + name + "\" was not found.");
        }
        return driver.createConnection();
    }

    public getDriver(name: string = "default"): Driver|undefined{
        return this.driverMap.get(name);
    }

    public getModelDescriptor(): ModelDescriptor{
        return this.modelDescriptor;
    }

    public static getInstance(): Model{
        return new Model();
    }
}
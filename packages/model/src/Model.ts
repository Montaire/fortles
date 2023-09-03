import { ModelContext } from "./ModelConext.js";
import { Connection, ModelDescriptor, MigrationRunner, Driver } from "./index.js";

declare const modelContext: ModelContext|undefined;

export class Model{

    protected static instance?: Model;

    protected modelDescriptor: ModelDescriptor;
    protected driverMap: Map<string, Driver>;
    protected globalContext: ModelContext;
    protected migrartionRunner: MigrationRunner;

    constructor(modelDescriptor: ModelDescriptor = new ModelDescriptor(), driverMap = new  Map<string, Driver>()){
        this.modelDescriptor = modelDescriptor;
        this.driverMap = driverMap;
        this.globalContext = new ModelContext();
        this.migrartionRunner = new MigrationRunner(this);
    }

    public migrate(): void{
        this.migrartionRunner.migrate();
    }

    public getMigrationRunner(): MigrationRunner{
        return this.migrartionRunner;
    }

    public getDriverMap(): Map<string, Driver>{
        return this.driverMap;
    }

    /**
     * Sets a driver with its name and create a connection for it in the global context.
     * @param driver Driver to add
     */
    public async setDriver(driver: Driver): Promise<void>{
        this.driverMap.set(driver.getName(), driver);
        await this.globalContext.createConnection(driver);
    }

    /**
     * Gets a connection by its name. If a local context is present it will be served,
     * othervise the global conttext will be used.
     * A connection is always immutable.
     * @param name Name of the connection.
     * @returns The connection instance.
     */
    public static getConnection(name: string = "default"): Connection{
        if(typeof modelContext !== "undefined" && modelContext){
            return modelContext.getConnection(name);
        }else{
            return this.getInstance().globalContext.getConnection(name);
        }
    }

    public getAllGlobalConnections(): Iterable<Connection>{
        return this.globalContext.getAllConnections();
    }

    public getDriver(name: string = "default"): Driver|undefined{
        return this.driverMap.get(name);
    }

    public getModelDescriptor(): ModelDescriptor{
        return this.modelDescriptor;
    }

    public static getInstance(): Model{
        if(!this.instance){
            this.instance = new Model();
        }
        return this.instance;
    }
}
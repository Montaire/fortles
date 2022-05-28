import { Application } from "../Application.js";
import { ServiceContainer } from "../index.js";


export default class DefaultServiceContainer extends ServiceContainer{
    
    public prepare(application: Application): void {
        this.listenOnPartialPath("fortles");
    }

    public getContainerType(): null {
        return null;
    }
}
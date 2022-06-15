import { Application } from "../Application.js";
import { ServiceContainer } from "../index.js";


export default class DefaultServiceContainer extends ServiceContainer{
    
    public override prepare(application: Application): void {
        this.listenOnPartialPath("fortles");
    }

    public override getContainerType(): null {
        return null;
    }
}
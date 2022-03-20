import ServiceContainer from "./ServiceContainer";

export default class DefaultServiceContainer extends ServiceContainer{
    constructor(){
        super();
        this.listenOnPartialPath("service");
    }
}
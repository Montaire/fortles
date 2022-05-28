import { ServiceContainer } from "../index.js";
export default class DefaultServiceContainer extends ServiceContainer {
    prepare(application) {
        this.listenOnPartialPath("fortles");
    }
    getContainerType() {
        return null;
    }
}
//# sourceMappingURL=DefaultServiceContainer.js.map
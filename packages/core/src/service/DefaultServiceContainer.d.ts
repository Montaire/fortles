import { Application } from "../Application.js";
import { ServiceContainer } from "../index.js";
export default class DefaultServiceContainer extends ServiceContainer {
    prepare(application: Application): void;
    getContainerType(): null;
}

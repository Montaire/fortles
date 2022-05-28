var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { string, integer, primaryKey, generated, Entity } from "../index.js";
class TestEntity extends Entity {
    id = 0;
    name;
}
__decorate([
    primaryKey,
    generated,
    integer()
], TestEntity.prototype, "id", void 0);
__decorate([
    string()
], TestEntity.prototype, "name", void 0);
describe("Entity", function () {
    let entity = null;
    before("Create new Entity", function () {
        entity = new TestEntity();
    });
    it("Where processed correctly", function () {
    });
});
//# sourceMappingURL=Entity.spec.js.map
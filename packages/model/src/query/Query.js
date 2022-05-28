export default class Query {
    first(condition) {
        if (condition) {
            this.where(condition);
        }
        for (let item of this) {
            return item;
        }
        return null;
    }
}
//# sourceMappingURL=Query.js.map
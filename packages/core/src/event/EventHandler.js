export default class EventHandler {
    eventListener;
    add(eventListener) {
        this.eventListener.push(eventListener);
    }
    remove(eventListener) {
        this.eventListener = this.eventListener.filter(x => x === eventListener);
    }
    dispatch(...args) {
        for (const event of this.eventListener) {
            event(...arguments);
        }
    }
}
//# sourceMappingURL=EventHandler.js.map
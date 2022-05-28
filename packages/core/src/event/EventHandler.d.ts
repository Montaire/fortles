export default class EventHandler<E extends (...args: any) => any> {
    eventListener: E[];
    add(eventListener: E): void;
    remove(eventListener: E): void;
    dispatch(...args: Parameters<E>): void;
}

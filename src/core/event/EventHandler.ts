export default class EventHandler<E extends (...args: any) => any>{

    eventListener: E[];

    add(eventListener: E): void{
        this.eventListener.push(eventListener);
    }

    remove(eventListener: E): void{
        this.eventListener = this.eventListener.filter(x => x === eventListener);
    }

    dispatch(...args: Parameters<E>){
        for(const event of this.eventListener){
            event(...arguments);
        }
    }
}
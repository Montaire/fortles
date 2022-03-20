type EventHandler<E> = (event: E) => void;

export default class EventManager<K, E>{

    eventHandlerMap = new Map<K, E[]>();

    add(eventListener: (event: E) => void){

    }

    remove(eventListener: (event: E) => void){

    }

    trigger(event: E, key: K = null){
        let e = new Event("sdc");
    }
}
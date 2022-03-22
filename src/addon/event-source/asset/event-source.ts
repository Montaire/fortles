class Fortles{
    static eventSource: EventSource;
};
if(window.EventSource) {
    Fortles.eventSource = new EventSource("/service/event-source");
} else {
    console.warn("Your browser doesn't support SSE");
}
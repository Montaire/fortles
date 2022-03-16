class Fortles{
    static eventSource: EventSource;
};
if(window.EventSource) {
    Fortles.eventSource = new EventSource("/fortles/event-source");

    Fortles.eventSource.addEventListener("hot-reload", e => {
        location.reload();
    }, false);

} else {
    console.warn("Your browser doesn't support SSE");
}
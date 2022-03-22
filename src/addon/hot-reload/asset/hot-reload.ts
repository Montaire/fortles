
if(Fortles.eventSource) {
    Fortles.eventSource.addEventListener("hot-reload", e => {
        location.reload();
    }, false);
} else {
    console.warn("Event source is not loaded.");
}
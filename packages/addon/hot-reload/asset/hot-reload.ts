
if(Fortles.eventSource) {

    Fortles.eventSource.addEventListener("reload", e => {
        location.reload();
    });

    Fortles.eventSource.addEventListener("reload-block", e => {
        Fortles.loadBlock(e.data);
    });

    Fortles.eventSource.addEventListener("reload-all", async e => {
        document.open();
        document.write(await (await fetch(location.href)).text());
        document.close();
    });

    Fortles.eventSource.addEventListener("reload-script", e => {
        let element = document.querySelector("script[src='"+ e.data +"']");
        let newElement = document.createElement("script");
        element.after(newElement);
        newElement.remove();
        //element.parentElement.replaceChild(newElement, element);
    });

    Fortles.eventSource.addEventListener("reload-style", e => {
        let element = document.querySelector("link[href='"+ e.data +"']");
        let newElement = document.createElement("link");
        newElement.rel = "stylesheet";
        newElement.href = e.data;
        //element.parentElement.replaceChild(newElement, element);
    });

} else {
    console.warn("Event source is not loaded.");
}
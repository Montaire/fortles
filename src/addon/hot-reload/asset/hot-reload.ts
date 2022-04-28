
if(Fortles.eventSource) {

    Fortles.eventSource.addEventListener("reload-asset", e => {
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
        
    });

    Fortles.eventSource.addEventListener("reload-style", e => {
        let element = document.querySelector("link[href='"+ e.data +"']");
        let newElement = document.createElement("link");
        newElement.href = e.data;
        element.parentNode.replaceChild(element,newElement);
    });

} else {
    console.warn("Event source is not loaded.");
}
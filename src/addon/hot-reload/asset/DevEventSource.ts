class DevEventSource {
    constructor(){
        if(window.EventSource) {
            var source = new EventSource('/dev');
        
            source.addEventListener('message', e => {
              this.onMessage(e.data);
            }, false);
        
            source.addEventListener('open', e => {
                console.log("Dev Server Connected");
            }, false);
        
            source.addEventListener('error', (e: any) => {
                const state = document.getElementById('state')
                if (e.eventPhase == EventSource.CLOSED)
                    source.close();
                if (e.target.readyState == EventSource.CLOSED) {
                    console.log("Dev Server Disconnected");
                }
                else if (e.target.readyState == EventSource.CONNECTING) {
                    console.log("Dev Server Connecting...");
                }
            }, false);
        } else {
            console.log("Your browser doesn't support SSE")
        }
    }

    protected onMessage(data: object){
        
    }
}
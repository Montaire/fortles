import { AssetService, ScriptAsset, ServiceContainer } from "@fortles/core";
import { ServerRequest, ServerResponse } from "@fortles/platform.server";
export default class EventSourceService extends ServiceContainer {
    clients = [];
    async prepare(application) {
        this.listenOnFullPath("event-source");
        let asset = new ScriptAsset(await import.meta.resolve("../asset/event-source.js"));
        application.getService(AssetService).add(asset);
    }
    onRequest(request, response, path, partialPath) {
        if (response instanceof ServerResponse && request instanceof ServerRequest) {
            let originalResponse = response.getOriginal();
            //Create event stream
            originalResponse.writeHead(200, {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive"
            });
            this.clients.push(originalResponse);
            request.getOriginal().on('close', () => {
                this.clients = this.clients.filter(x => x === originalResponse);
            });
        }
    }
    send(event, message = "") {
        for (const client of this.clients) {
            client.write("event:" + event + "\ndata:" + message.replace("\n", "\\n") + "\n\n");
        }
    }
    dropClients() {
        for (const client of this.clients) {
            client.end();
        }
    }
}
//# sourceMappingURL=EventSourceService.js.map
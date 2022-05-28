/// <reference types="node" />
import { Addon, Application, Request, Response, ServiceContainer } from "@fortles/core";
import * as http from "http";
export default class EventSourceService extends ServiceContainer implements Addon {
    protected clients: http.ServerResponse[];
    prepareAddon(application: Application): Promise<void>;
    prepare(application: Application): void;
    onRequest(request: Request, response: Response, path: string, partialPath: string): void;
    send(event: string, message?: string): void;
    dropClients(): void;
}

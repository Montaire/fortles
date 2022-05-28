/// <reference types="node" />
import { ChildProcess } from "child_process";
import chokidar from "chokidar";
export declare type DevelopmentServerConfig = {
    port?: number;
    path?: string;
    watchFramework?: boolean;
    watchProject?: boolean;
};
export default class DevelopmentServer {
    protected defaultConfig: DevelopmentServerConfig;
    protected config: DevelopmentServerConfig;
    protected watcher: chokidar.FSWatcher;
    protected childProcess: ChildProcess;
    start(config: DevelopmentServerConfig): Promise<void>;
    /**
     * Runs a development server
     * if the development server already running, restarts it.
     */
    protected run(): void;
    protected onChange(path: string): void;
}

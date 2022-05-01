import { ChildProcess, fork } from "child_process";
import * as url from "url";
import * as Path from "path";
import chokidar from "chokidar";

export type DevelopmentServerConfig = {
    port?: number,
    path?: string,
    watchFramework?: boolean,
    watchProject?: boolean,
}

export default class DevelopmentServer{

    protected defaultConfig: DevelopmentServerConfig = {
        port: 8080,
        path: "./",
        watchFramework: false,
        watchProject: true,
    };
    protected config: DevelopmentServerConfig;

    protected watcher: chokidar.FSWatcher;
    protected childProcess: ChildProcess;

    public async start(config: DevelopmentServerConfig){
        this.config = Object.assign({}, this.defaultConfig, config);
        let watchPaths: string[] = [];
        //1. Watch file changes
        if(this.config .watchProject){
            watchPaths.push(process.cwd());
        }
        if(this.config.watchFramework){
            //Watching the monorepo's src folder
            watchPaths.push(Path.normalize(url.fileURLToPath(import.meta.url) + "../../.."));
        }
        console.info("Watching the fallowing paths:\n" + watchPaths.join("\n"));
        this.watcher = chokidar.watch(watchPaths);
        this.watcher.on("change", path => this.onChange(path));
        //2. Run migrations
        

        //3. Run server (run allows re running as well)
        this.run();
        
        process.on("exit", (code) => {
            this.childProcess.send({action: "exit", data: code});
        });
    }

    /**
     * Runs a development server
     * if the development server already running, restarts it.
     */
    protected run(){
        if(this.childProcess){
            this.childProcess.send({action: "exit", data: "reload"});
        }
        this.childProcess = fork(
            Path.normalize(url.fileURLToPath(import.meta.url) + "/../run.js"),
            [JSON.stringify(this.config)],
            {execArgv:['--enable-source-maps', '--experimental-import-meta-resolve']}
        );
    }

    protected onChange(path: string){
        if(Path.extname(path) == ".ts"){
            console.info("Source changed: " + path);
            this.run();
            return;
        }

        if(Path.extname(path) == ".html"){
            this.childProcess.send({
                action: "reload",
                data: path
            });
            return;
        }

        if(path.includes("asset")){
            this.childProcess.send({
                action: "reload", 
                data: path
            });
            return;
        }
    }
}
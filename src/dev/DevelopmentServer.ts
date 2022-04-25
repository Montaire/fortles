import { fork } from "child_process";
import { fileURLToPath } from "url";
import { normalize } from "path";

export type DevelopmentServerConfig = {
    port?: number,
    path?: string
}

export default class DevelopmentServer{

    protected defaultConfig: DevelopmentServerConfig = {
        port: 8080,
        path: "./"
    };

    public async start(config: DevelopmentServerConfig){
        config = Object.assign({}, this.defaultConfig, config);
        //1. Watch file changes

        //2. Run migrations

        //3. Load config

        //4. Run server
        let childProcess = fork(
            normalize(fileURLToPath(import.meta.url) + "/../run.js"),
            [JSON.stringify(config)],
            //{execArgv:['--inspect-brk']}
        );

        process.on("exit", (code) => {
            childProcess.send({action: "exit"});
        });
        /*childProcess.send({action: "exit"});
        childProcess.kill("SIGQUIT");*/
    }
}
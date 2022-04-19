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
        console.log(config, this.defaultConfig);
        config = Object.assign({}, this.defaultConfig, config);
        //1. Watch file changes
        console.log(config.port);
        //2. Run migrations

        //3. Load config

        //4. Run server
        let childProcess = fork(normalize(fileURLToPath(import.meta.url) + "/../run.js"),[JSON.stringify(config)]);
        /*childProcess.send({action: "exit"});
        childProcess.kill("SIGQUIT");*/
    }
}
import { normalize } from "path";
//import { Migrator } from "./src/index.js";

export default function(program){
    program.command("migrate")
        .description("Migrations")
        .option("-r, --reset", "Resets database from the seed files.")
        .action(config => {
            //let migrator = new Migrator();
            //migrator.run([normalize(process.cwd() + '/src/model')], config);
        });
}

console.log("kecsle");
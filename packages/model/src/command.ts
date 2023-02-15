import { Command } from "@fortles/command";

export default function(command: Command){
    command.addCommand('migrate')
        .setTitle("Migration")
        .setDescription("Commands to keep your database in sync with your code")
        .addOption("reset", "Resets the database from the seed files.")
        .setAction(config => {
            /*const migrator = new Migrator();
            migrator.run([normalize(process.cwd() + '/src/model')], config);*/
        });
}
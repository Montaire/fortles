import { EntityDescriptor } from "../index.js";
import * as fs from "fs";
import { extname, resolve } from "path";
import { pathToFileURL } from "url";
import DependencyGraph from "./DependencyGraph.js";
export class Migrator {
    async run(paths, config) {
        //Collect entites from the project and plugin paths
        const entities = await this.collect(paths);
        //Build Descriptors: solve inheritance
        const descriptors = EntityDescriptor.build(entities);
        //Create dependency graph: check for unresolvable constraints
        const dependencyGraph = new DependencyGraph(descriptors);
        //Check for changes
        //Build execution tree
    }
    create(entityType) {
    }
    async collect(rootFolders) {
        let result = [];
        for (const rootFolder of rootFolders) {
            let files = fs.readdirSync(rootFolder, { withFileTypes: true });
            for (const file of files) {
                if (file.isDirectory()) {
                    result.concat(await this.collect([file.name]));
                }
                else if (extname(file.name) == ".js") {
                    let url = pathToFileURL(resolve(rootFolder, file.name));
                    result.push(await import(url.toString()));
                }
            }
        }
        return result;
    }
}
//# sourceMappingURL=Migrator.js.map
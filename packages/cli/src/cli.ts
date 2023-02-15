#!/bin/sh 
":" //# comment; exec /usr/bin/env node --experimental-import-meta-resolve "$0" "$@"

import * as fs from "fs";
import { fileURLToPath } from "url";
import { Command } from "@fortles/command";

let command = new Command("fortles");

let packageJson = JSON.parse(fs.readFileSync("./package.json", {encoding: "utf-8"}));
let success: boolean = false;

if(packageJson && (packageJson.dependencies || packageJson.devDependencies)){
    let ownPackage = JSON.parse(fs.readFileSync(fileURLToPath(import.meta.url + "/../../package.json"), {encoding: "utf-8"}));
    let availableDependencies = ownPackage.optionalDependencies;
    let dependencies: string[] = [];
    if(packageJson.dependencies){
        for(const dependency in packageJson.dependencies){
            if(availableDependencies[dependency]){
                dependencies.push(dependency);
            }
        }
    }
    if(packageJson.devDependencies){
        for(const dependency in packageJson.devDependencies){
            if(availableDependencies[dependency]){
                dependencies.push(dependency);
            }
        }
    }
    for(const dependency of dependencies){
        if(dependency.startsWith("@fortles")){
            console.log(dependency + "/src/command.js");
            try{
                let commandDecorator = await import(dependency + "/src/command.js");      
                commandDecorator.default(command);
                success = true;
            }catch(error){
                console.error(error);
            }
        }
    }
}

if(success){
    command.run();
}else{
    console.error(`You dont have any dependency with cli in your "package.json". 
Consider to add "@fortles/dev" in your devDependencies.`);
}
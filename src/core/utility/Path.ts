import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { Module } from 'module'

export default class Path{
    static getBasePath(){
        dirname(process.argv[1])
    }

    static resolveMeta(path: string, meta: ImportMeta){
        return resolve(dirname(fileURLToPath(meta.url)), path);
    }
}
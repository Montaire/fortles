import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Module } from 'module'

export default class Path{
    static getBasePath(){
        dirname(process.argv[1])
    }
}
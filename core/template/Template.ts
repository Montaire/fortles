//import {TemplateShard} from "./index.js";
import SyncFileReadableStream from "../../utility/SyncFileReadableStream.js";

export default class Template /*extends TemplateShard*/{
	public name: any;
	public application: any;
	public prepare: any;

    constructor(path, name?, application?){
        super(null);
        let reader = new SyncFileReadableStream(path);
        this.name = name;
        this.application = application;
        this.prepare(reader);
    }

    getName(){
        return this.name;
    }
}
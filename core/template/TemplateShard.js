import {Shard, WriteableShard, EvalWriteableShard, BlockControlShard} from "./index.js";

export default class TemplateShard extends Shard{

    static States = {
        TEXT_START: 1,
        TEXT: 2,
        EVAL_START: 3,
        EVAL: 4,
        EVAL_END: 5,
        CONTROL_START: 6,
        CONTROL: 7,
        CONTROL_STOP_START: 8,
        CONTROL_STOP: 9,
        LOCALIZATON_START: 10,
        LOCALIZATON: 11,
        LOCALIZATON_END: 12,
    }

    /** @type {Shard[]} */
    shards = [];

    constructor(parent){
        super();
        this.parant = parent;
        this.shards = [];
    }
    /**
     * @param {ReadableStream} reader 
     * @returns 
     */
    prepare(reader){
        let shard = new WriteableShard();
        let state = TemplateShard.States.TEXT_START;
        let c;
        while ((c = reader.read(1)) !== null) {
            switch (state) {
                case TemplateShard.States.TEXT_START:
                    state = TemplateShard.States.TEXT;
                    shard = new WriteableShard();
                case TemplateShard.States.TEXT:
                    switch (c) {
                        case '{':
                            state = TemplateShard.States.EVAL_START;
                            break;
                        case '<':
                            state = TemplateShard.States.CONTROL_START;
                            break;
                        case '_':
                            state = TemplateShard.States.LOCALIZATION_START;
                            break;
                        default:
                            shard.write(c);
                            break;
                    }
                    ;
                    break;
                case TemplateShard.States.EVAL_START:
                    switch (c) {
                        case '{':
                            this.append(shard);
                            state = TemplateShard.States.EVAL;
                            shard = new EvalWriteableShard();
                            break;
                        default:
                            state = TemplateShard.States.TEXT;
                            shard.write('{');
                            shard.write(c);
                            break;
                    }
                    break;
                case TemplateShard.States.EVAL:
                    switch (c) {
                        case '}':
                            state = TemplateShard.States.EVAL_END;
                            break;
                        default:
                            shard.write(c);
                            break;
                    }
                    break;
                case TemplateShard.States.EVAL_END:
                    switch (c) {
                        case '}':
                            this.append(shard);
                            state = TemplateShard.States.TEXT_START;
                            break;
                        default:
                            state = TemplateShard.States.EVAL;
                            shard.write('}');
                            shard.write(c);
                            break;
                    }
                    break;
                case TemplateShard.States.CONTROL_START:
                    switch (c) {
                        case 'e':
                            state = TemplateShard.States.CONTROL;
                            break;
                        case '/':
                            if (this.shardName != null) {
                                state = TemplateShard.States.CONTROL_STOP_START;
                                break;
                            }//Falling to default if shardName is not set.
                        default:
                            state = TemplateShard.States.TEXT;
                            shard.write('<');
                            shard.write(c);
                            break;
                    }
                    break;
                case TemplateShard.States.CONTROL:
                    switch (c) {
                        case ':':
                            this.append(shard);
                            this.prepareControl(reader);
                            state = TemplateShard.States.TEXT_START;
                            shard = new WriteableShard();
                            break;
                        default:
                            state = TemplateShard.States.TEXT;
                            shard.write('<');
                            shard.write('e');
                            shard.write(c);
                            break;
                    }
                    break;
                case TemplateShard.States.CONTROL_STOP_START:
                    switch (c) {
                        case 'e':
                            state = TemplateShard.States.CONTROL_STOP;
                            break;
                        default:
                            state = TemplateShard.States.TEXT;
                            shard.write('<');
                            shard.write('/');
                            shard.write(c);
                            break;
                    }
                    ;
                    break;
                case TemplateShard.States.CONTROL_STOP:
                    switch (c) {
                        case ':':
                            if (end(reader, shard)) {
                                this.append(shard);
                                return;
                            }
                            break;
                        default:
                            state = TemplateShard.States.TEXT;
                            shard.write('<');
                            shard.write('/');
                            shard.write('e');
                            shard.write(c);
                            break;
                    }
                    break;
                case TemplateShard.States.LOCALIZATION_START:
                    switch (c) {
                        case '"':
                            this.append(shard);
                            state = TemplateShard.States.LOCALIZATION;
                            shard = new LocalizationWriteableShard();
                            break;
                        default:
                            state = TemplateShard.States.TEXT;
                            shard.write('_');
                            shard.write(c);
                            break;
                    }
                    break;
                case TemplateShard.States.LOCALIZATION:
                    switch (c) {
                        case '"':
                            state = TemplateShard.States.LOCALIZATION_END;
                            break;
                        default:
                            shard.write(c);
                            break;
                    }
                    break;
                case TemplateShard.States.LOCALIZATION_END:
                    switch (c) {
                        case '_':
                            this.append(shard);
                            state = TemplateShard.States.TEXT_START;
                            break;
                        default:
                            state = TemplateShard.States.LOCALIZATION;
                            shard.write('"');
                            shard.write(c);
                            break;
                    }
                    break;
            }
        }
        this.append(shard);
    }

    append(shard){
        shard.ready();
        if(!shard.isEmpty()){
            this.shards.push(shard);
        }
    }

    shardFactory(name, reader){
        switch (name) {
            case "block":
                return new BlockControlShard(reader, this);
            case "for":
                return new ForControlShard(reader, this);
            case "form":
                return new FormControlShard(reader, this);
            case "a":
                return new AnchorControlShard(reader, this);
            case "if":
                return new IfControlShard(reader, this);
            case "input":
                return new InputControlShard(reader, this);
            default:
                throw new NoClassDefFoundError("There is no 'TemplateShard' definiton for '" + name + "'");
        }
    }

    prepareControl(reader){
        let c;
        let controlName = '';
        while ((c = reader.read()) != -1) {
            if (c != ' ' && c != '>') {
                controlName += c;
            } else {
                break;
            }
        }
        let shard = this.shardFactory(controlName, reader);
        this.shards.push(shard);
    }

    /**
     * Checkis wether the current statmenet ended. Overwrite, if something must
     * be added after the shard ending.
     *
     * @param {ReadableStream} reader The input stream, dont touch it.
     * @param {Shard} shard The current shard, you can touch it.
     * @return {boolean} Returns true if the shard is ended.
     */
     end(reader, shard){
        for (let i in this.shardName) {
            let c = reader.read();
            if (c == -1 || this.shardName[i] != c) {
                shard.write(this.shardName.substring(0, i));
                return false;
            }
            i++;
        }
        let c = reader.read();
        //If we have the closing tag return true, the current block is ended
        return c == '>';
    }

    /**
     * Renders all the embedded shards
     * @param {import("../render/RenderEngine.js").RenderEngine} engine 
     * @param {import("../Request.js").Request} request 
     * @param {import("../Response.js").Response} response 
     */
    render(engine, request, response){
        for(let shard of this.shards){
            shard.render(engine, request, response);
        }
    }
}
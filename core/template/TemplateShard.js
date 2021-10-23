const Shard = require("essentials/core/template/Shard");

class TemplateShard extends Shard{
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

    constructor(parent){
        super();
        this.parant = parent;
        this.shards = [];
    }
    /**
     * @param {FileSystem} reader 
     * @returns 
     */
    prepare(reader){
        shard = new TextWriteableShard();
        state = TemplateShard.States.TEXT_START;
        let c;
        while ((c = reader.read()) != -1) {
            switch (state) {
                case TemplateShard.States.TEXT_START:
                    state = States.TEXT;
                    shard = new TextWriteableShard();
                case TemplateShard.States.TEXT:
                    switch (c) {
                        case '{':
                            state = States.EVAL_START;
                            break;
                        case '<':
                            state = States.CONTROL_START;
                            break;
                        case '_':
                            state = States.LOCALIZATION_START;
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
                            state = States.EVAL;
                            shard = new EvalWriteableShard();
                            break;
                        default:
                            state = States.TEXT;
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
                            if (shardName != null) {
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
                            prepareControl(reader);
                            state = TemplateShard.States.TEXT_START;
                            shard = new TextWriteableShard();
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
                            state = States.TEXT;
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
        this.this.append(shard);
    }

    append(shard){
        shard.ready();
        if(!shard.isEmpty()){
            shards.add(shard);
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
        controlName = new StringBuilder();
        while ((c = reader.read()) != -1) {
            if (c != ' ' && c != '>') {
                controlName.append(c);
            } else {
                break;
            }
        }
        shard = this.shardFactory(controlName.toString(), reader);
        shards.add(shard);
    }

    /**
     * Renders all the embedded shards
     * @param {require("essentials/core/render/RenderEngine").RenderEngine} engine 
     * @param {require("essentials").Request} request 
     * @param {require("essentials").Response} response 
     */
    render(engine, request, response){
        for(let shard of this.shards){
            shard.render(engine, request, response);
        }
    }
}

module.exports = TemplateShard;
import {Shard, WriteableShard, EvalWriteableShard, BlockControlShard} from "./";
import {Request, Response} from '../../../';
import CharacterStreamReader from "essentials/src/utility/CharacterStreamReader";
import RenderEngine from "essentials/src/core/render/RenderEngine";

export const enum TemplateShardStates{
    TEXT_START,
    TEXT,
    EVAL_START,
    EVAL,
    EVAL_END,
    CONTROL_START,
    CONTROL,
    CONTROL_STOP_START,
    CONTROL_STOP,
    LOCALIZATION_START,
    LOCALIZATION,
    LOCALIZATION_END,
}

export default class TemplateShard implements Shard{
    
	protected parant: TemplateShard;
	protected shardName: string
    protected shards: Shard[] = [];

    constructor(parent: TemplateShard){
        this.parant = parent;
        this.shards = [];
    }

    prepare(reader: CharacterStreamReader): void {
        let shard = new WriteableShard();
        let state = TemplateShardStates.TEXT_START;
        let c: string;
        while ((c = reader.read()) !== null) {
            switch (state) {
                case TemplateShardStates.TEXT_START:
                    state = TemplateShardStates.TEXT;
                    shard = new WriteableShard();
                case TemplateShardStates.TEXT:
                    switch (c) {
                        case '{':
                            state = TemplateShardStates.EVAL_START;
                            break;
                        case '<':
                            state = TemplateShardStates.CONTROL_START;
                            break;
                        case '_':
                            state = TemplateShardStates.LOCALIZATION_START;
                            break;
                        default:
                            shard.write(c);
                            break;
                    }
                    ;
                    break;
                case TemplateShardStates.EVAL_START:
                    switch (c) {
                        case '{':
                            this.append(shard);
                            state = TemplateShardStates.EVAL;
                            shard = new EvalWriteableShard();
                            break;
                        default:
                            state = TemplateShardStates.TEXT;
                            shard.write('{');
                            shard.write(c);
                            break;
                    }
                    break;
                case TemplateShardStates.EVAL:
                    switch (c) {
                        case '}':
                            state = TemplateShardStates.EVAL_END;
                            break;
                        default:
                            shard.write(c);
                            break;
                    }
                    break;
                case TemplateShardStates.EVAL_END:
                    switch (c) {
                        case '}':
                            this.append(shard);
                            state = TemplateShardStates.TEXT_START;
                            break;
                        default:
                            state = TemplateShardStates.EVAL;
                            shard.write('}');
                            shard.write(c);
                            break;
                    }
                    break;
                case TemplateShardStates.CONTROL_START:
                    switch (c) {
                        case 'e':
                            state = TemplateShardStates.CONTROL;
                            break;
                        case '/':
                            if (this.shardName != null) {
                                state = TemplateShardStates.CONTROL_STOP_START;
                                break;
                            }//Falling to default if shardName is not set.
                        default:
                            state = TemplateShardStates.TEXT;
                            shard.write('<');
                            shard.write(c);
                            break;
                    }
                    break;
                case TemplateShardStates.CONTROL:
                    switch (c) {
                        case ':':
                            this.append(shard);
                            this.prepareControl(reader);
                            state = TemplateShardStates.TEXT_START;
                            shard = new WriteableShard();
                            break;
                        default:
                            state = TemplateShardStates.TEXT;
                            shard.write('<');
                            shard.write('e');
                            shard.write(c);
                            break;
                    }
                    break;
                case TemplateShardStates.CONTROL_STOP_START:
                    switch (c) {
                        case 'e':
                            state = TemplateShardStates.CONTROL_STOP;
                            break;
                        default:
                            state = TemplateShardStates.TEXT;
                            shard.write('<');
                            shard.write('/');
                            shard.write(c);
                            break;
                    }
                    ;
                    break;
                case TemplateShardStates.CONTROL_STOP:
                    switch (c) {
                        case ':':
                            if (this.end(reader, shard)) {
                                this.append(shard);
                                return;
                            }
                            break;
                        default:
                            state = TemplateShardStates.TEXT;
                            shard.write('<');
                            shard.write('/');
                            shard.write('e');
                            shard.write(c);
                            break;
                    }
                    break;
                case TemplateShardStates.LOCALIZATION_START:
                    switch (c) {
                        case '"':
                            this.append(shard);
                            state = TemplateShardStates.LOCALIZATION;
                            shard = new /*TODO: Localization*/WriteableShard();
                            break;
                        default:
                            state = TemplateShardStates.TEXT;
                            shard.write('_');
                            shard.write(c);
                            break;
                    }
                    break;
                case TemplateShardStates.LOCALIZATION:
                    switch (c) {
                        case '"':
                            state = TemplateShardStates.LOCALIZATION_END;
                            break;
                        default:
                            shard.write(c);
                            break;
                    }
                    break;
                case TemplateShardStates.LOCALIZATION_END:
                    switch (c) {
                        case '_':
                            this.append(shard);
                            state = TemplateShardStates.TEXT_START;
                            break;
                        default:
                            state = TemplateShardStates.LOCALIZATION;
                            shard.write('"');
                            shard.write(c);
                            break;
                    }
                    break;
            }
        }
        this.append(shard);
    }

    append(shard: WriteableShard): void{
        shard.ready();
        if(!shard.isEmpty()){
            this.shards.push(shard);
        }
    }

    shardFactory(name: string, reader: CharacterStreamReader): Shard{
        switch (name) {
            case "block":
                return new BlockControlShard(reader, this);
            /*case "for":
                return new ForControlShard(reader, this);
            case "form":
                return new FormControlShard(reader, this);
            case "a":
                return new AnchorControlShard(reader, this);
            case "if":
                return new IfControlShard(reader, this);
            case "input":
                return new InputControlShard(reader, this);*/
            default:
                throw new Error("There is no 'TemplateShard' definiton for '" + name + "'");
        }
    }

    prepareControl(reader: CharacterStreamReader): void{
        let c: string;
        let controlName = '';
        while ((c = reader.read()) !== null) {
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
     * @param reader The input stream, dont touch it.
     * @param shard The current shard, you can touch it.
     * @return Returns true if the shard is ended.
     */
     end(reader: CharacterStreamReader, shard: WriteableShard): boolean {
        for (let i=0; i<this.shardName.length; i++) {
            let c = reader.read();
            if (c === null || this.shardName[i] !== c) {
                shard.write(this.shardName.substring(0, i));
                return false;
            }
        }
        let c = reader.read();
        //If we have the closing tag return true, the current block is ended
        return c == '>';
    }

    /**
     * Renders all the embedded shards
     * @param engine 
     * @param request 
     * @param response 
     */
    render(engine: RenderEngine, request: Request, response: Response): void{
        for(let shard of this.shards){
            shard.render(engine, request, response);
        }
    }
}
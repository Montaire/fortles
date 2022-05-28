import { WriteableShard, EvalWriteableShard, BlockControlShard, Template, AnchorControlShard, ButtonControlShard, IfControlShard, InputControlShard, FormatControlShard } from "../index.js";
export default class TemplateShard {
    parent;
    shardName;
    shards = [];
    namespace = 'f';
    constructor(parent) {
        this.parent = parent;
        this.shards = [];
    }
    prepare(reader) {
        let shard = new WriteableShard();
        let state = 0 /* TemplateShardStates.TEXT */;
        let evalBraclet = 1;
        let c;
        while ((c = reader.read()) !== null) {
            switch (state) {
                case 0 /* TemplateShardStates.TEXT */:
                    switch (c) {
                        case '$':
                            state = 1 /* TemplateShardStates.EVAL_START */;
                            break;
                        case '<':
                            state = 3 /* TemplateShardStates.CONTROL_START */;
                            break;
                        case '_':
                            state = 7 /* TemplateShardStates.LOCALIZATION_START */;
                            break;
                        default:
                            shard.write(c);
                            break;
                    }
                    break;
                case 1 /* TemplateShardStates.EVAL_START */:
                    switch (c) {
                        case '{':
                            this.append(shard);
                            state = 2 /* TemplateShardStates.EVAL */;
                            shard = new EvalWriteableShard(reader.getCursorPath());
                            evalBraclet = 1;
                            break;
                        case '\\': //Escape the template literal
                            state = 0 /* TemplateShardStates.TEXT */;
                            shard.write('$');
                            break;
                        default:
                            state = 0 /* TemplateShardStates.TEXT */;
                            shard.write('$');
                            shard.write(c);
                            break;
                    }
                    break;
                case 2 /* TemplateShardStates.EVAL */:
                    switch (c) {
                        case '{':
                            evalBraclet++;
                            shard.write(c);
                            break;
                        case '}':
                            evalBraclet--;
                            if (!evalBraclet) {
                                this.append(shard);
                                shard = new WriteableShard();
                                state = 0 /* TemplateShardStates.TEXT */;
                            }
                            else {
                                shard.write(c);
                            }
                            break;
                        default:
                            shard.write(c);
                            break;
                    }
                    break;
                case 3 /* TemplateShardStates.CONTROL_START */:
                    switch (c) {
                        case this.namespace:
                            state = 4 /* TemplateShardStates.CONTROL */;
                            break;
                        case '/':
                            if (this.shardName != null) {
                                state = 5 /* TemplateShardStates.CONTROL_STOP_START */;
                                break;
                            } //Falling to default if shardName is not set.
                        default:
                            state = 0 /* TemplateShardStates.TEXT */;
                            shard.write('<');
                            shard.write(c);
                            break;
                    }
                    break;
                case 4 /* TemplateShardStates.CONTROL */:
                    switch (c) {
                        case ':':
                            this.append(shard);
                            this.prepareControl(reader);
                            state = 0 /* TemplateShardStates.TEXT */;
                            shard = new WriteableShard();
                            break;
                        default:
                            state = 0 /* TemplateShardStates.TEXT */;
                            shard.write('<');
                            shard.write(this.namespace);
                            shard.write(c);
                            break;
                    }
                    break;
                case 5 /* TemplateShardStates.CONTROL_STOP_START */:
                    switch (c) {
                        case this.namespace:
                            state = 6 /* TemplateShardStates.CONTROL_STOP */;
                            break;
                        default:
                            state = 0 /* TemplateShardStates.TEXT */;
                            shard.write('<');
                            shard.write('/');
                            shard.write(c);
                            break;
                    }
                    ;
                    break;
                case 6 /* TemplateShardStates.CONTROL_STOP */:
                    switch (c) {
                        case ':':
                            if (this.end(reader, shard)) {
                                this.append(shard);
                                return;
                            }
                            break;
                        default:
                            state = 0 /* TemplateShardStates.TEXT */;
                            shard.write('<');
                            shard.write('/');
                            shard.write(this.namespace);
                            shard.write(c);
                            break;
                    }
                    break;
                case 7 /* TemplateShardStates.LOCALIZATION_START */:
                    switch (c) {
                        case '"':
                            this.append(shard);
                            state = 8 /* TemplateShardStates.LOCALIZATION */;
                            shard = new /*TODO: Localization*/ WriteableShard();
                            break;
                        default:
                            state = 0 /* TemplateShardStates.TEXT */;
                            shard.write('_');
                            shard.write(c);
                            break;
                    }
                    break;
                case 8 /* TemplateShardStates.LOCALIZATION */:
                    switch (c) {
                        case '"':
                            state = 9 /* TemplateShardStates.LOCALIZATION_END */;
                            break;
                        default:
                            shard.write(c);
                            break;
                    }
                    break;
                case 9 /* TemplateShardStates.LOCALIZATION_END */:
                    switch (c) {
                        case '_':
                            this.append(shard);
                            shard = new WriteableShard();
                            state = 0 /* TemplateShardStates.TEXT */;
                            break;
                        default:
                            state = 8 /* TemplateShardStates.LOCALIZATION */;
                            shard.write('"');
                            shard.write(c);
                            break;
                    }
                    break;
            }
        }
        this.append(shard);
    }
    append(shard) {
        shard.ready();
        if (!shard.isEmpty()) {
            this.shards.push(shard);
        }
    }
    createControlShard(name, reader, cursorPosition) {
        let shard;
        switch (name) {
            case "block":
                shard = new BlockControlShard(reader, this, cursorPosition);
                break;
            /*case "for":
                return new ForControlShard(reader, this);
            case "form":
                return new FormControlShard(reader, this);*/
            case "a":
                shard = new AnchorControlShard(reader, this, cursorPosition);
                break;
            case "button":
                shard = new ButtonControlShard(reader, this, cursorPosition);
                break;
            case "if":
                shard = new IfControlShard(reader, this, cursorPosition);
                break;
            case "input":
                shard = new InputControlShard(reader, this, cursorPosition);
                break;
            case "f":
                shard = new FormatControlShard(reader, this, cursorPosition);
                break;
            default:
                throw new Error("There is no 'TemplateShard' definiton for '" + name + "'");
        }
        shard.initialize(reader);
        return shard;
    }
    prepareControl(reader) {
        let c;
        let controlName = '';
        let cursorPosition;
        parser: while ((c = reader.read()) !== null) {
            switch (c) {
                case '/':
                    cursorPosition = 2 /* ControlShardCursorPosition.ENDED */;
                    continue;
                case '>':
                    if (!cursorPosition) {
                        cursorPosition = 1 /* ControlShardCursorPosition.INSIDE */;
                    }
                    break parser;
                case ' ':
                    cursorPosition = 0 /* ControlShardCursorPosition.ATTRIBUTES */;
                    break parser;
            }
            controlName += c;
        }
        let shard = this.createControlShard(controlName, reader, cursorPosition);
        this.shards.push(shard);
    }
    /**
     * Checks wether the current statmenet ended. Overwrite, if something must
     * be added after the shard ending.
     *
     * @param reader The input stream, dont touch it.
     * @param shard The current shard, you can touch it.
     * @return Returns true if the shard is ended.
     */
    end(reader, shard) {
        for (let i = 0; i < this.shardName.length; i++) {
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
    render(engine, request, response) {
        for (let shard of this.shards) {
            shard.render(engine, request, response);
        }
    }
    getParent() {
        return this.parent;
    }
    getTemplate() {
        let shard = this;
        while (shard.getParent() != null) {
            shard = shard.getParent();
        }
        if (shard instanceof Template) {
            return shard;
        }
        else {
            return null;
        }
    }
    /**
     * Gets the name of the whole Template.
     *
     * @return Name of the template
     */
    getTemplateName() {
        let template = this.getTemplate();
        if (template != null) {
            return template.getName();
        }
        else {
            return null;
        }
    }
    getApplication() {
        let template = this.getTemplate();
        if (template != null) {
            return template.getApplication();
        }
        else {
            return null;
        }
    }
    /**
     * Gets the children shards.
     * @returns Array of the Shards.
     */
    getShards() {
        return this.shards;
    }
}
//# sourceMappingURL=TemplateShard.js.map
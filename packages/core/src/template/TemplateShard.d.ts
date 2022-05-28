import { Shard, WriteableShard, Template, ControlShardCursorPosition, Request, Response, Application, CharacterStreamReader, RenderEngine } from "../index.js";
export declare const enum TemplateShardStates {
    TEXT = 0,
    EVAL_START = 1,
    EVAL = 2,
    CONTROL_START = 3,
    CONTROL = 4,
    CONTROL_STOP_START = 5,
    CONTROL_STOP = 6,
    LOCALIZATION_START = 7,
    LOCALIZATION = 8,
    LOCALIZATION_END = 9
}
export default class TemplateShard implements Shard {
    protected parent: TemplateShard;
    protected shardName: string;
    protected shards: Shard[];
    protected namespace: string;
    constructor(parent: TemplateShard);
    prepare(reader: CharacterStreamReader): void;
    append(shard: WriteableShard): void;
    createControlShard(name: string, reader: CharacterStreamReader, cursorPosition: ControlShardCursorPosition): Shard;
    prepareControl(reader: CharacterStreamReader): void;
    /**
     * Checks wether the current statmenet ended. Overwrite, if something must
     * be added after the shard ending.
     *
     * @param reader The input stream, dont touch it.
     * @param shard The current shard, you can touch it.
     * @return Returns true if the shard is ended.
     */
    end(reader: CharacterStreamReader, shard: WriteableShard): boolean;
    /**
     * Renders all the embedded shards
     * @param engine
     * @param request
     * @param response
     */
    render(engine: RenderEngine, request: Request, response: Response): void;
    getParent(): TemplateShard;
    getTemplate(): Template;
    /**
     * Gets the name of the whole Template.
     *
     * @return Name of the template
     */
    getTemplateName(): string;
    getApplication(): Application;
    /**
     * Gets the children shards.
     * @returns Array of the Shards.
     */
    getShards(): Shard[];
}

import { Entity } from "./index.js";
export declare type MigratorConfig = {};
export declare class Migrator {
    run(paths: string[], config: any): Promise<void>;
    protected create(entityType: typeof Entity[]): void;
    protected collect(rootFolders: string[]): Promise<typeof Entity[]>;
}

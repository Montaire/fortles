import { Entity } from "./index.js";
export declare type MigrationConfig = {
    paths: string;
};
export declare class Migration {
    run(config: any): Promise<void>;
    protected create(entityType: typeof Entity[]): void;
    protected collect(rootFolders: string[]): Promise<typeof Entity[]>;
}

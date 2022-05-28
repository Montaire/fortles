export default class Path {
    static getBasePath(): void;
    static resolveMeta(path: string, meta: ImportMeta): string;
}

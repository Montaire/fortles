import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
export default class Path {
    static getBasePath() {
        dirname(process.argv[1]);
    }
    static resolveMeta(path, meta) {
        return resolve(dirname(fileURLToPath(meta.url)), path);
    }
}
//# sourceMappingURL=Path.js.map
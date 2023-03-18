import glob from "glob";
import { promisify } from "util";
const proGlob = promisify(glob);

export default async function (dirName: string) {
    const FILES = await proGlob(`${__dirname}/../${dirName}/**/*.{js,ts}`);
    FILES.forEach((file) => {
        delete require.cache[require.resolve(file)];
    });
    return FILES;
}

import glob from "glob";
import { promisify } from "util";
const proGlob = promisify(glob);

export default async function getAllFiles(dirName: string) {
    const FILES = await proGlob(`${__dirname}/../${dirName}/**/*.{js,ts}`);
    console.info(`Found ${FILES.length} files in ${dirName}`);
    FILES.forEach((file) => {
        delete require.cache[require.resolve(file)];
    });
    return FILES;
}

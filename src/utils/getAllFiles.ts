import glob from "glob";
import { promisify } from "util";
const proGlob = promisify(glob);

export default async function (dirName: string) {
    const FILES = await proGlob(
        `${process.cwd().replace(/\\/g, "/")}/${dirName}/**/*.ts`
    );
    FILES.forEach((file) => {
        delete require.cache[require.resolve(file)];
    });
    return FILES;
}

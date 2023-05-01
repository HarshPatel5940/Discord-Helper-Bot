import { client } from "..";
import getAllFiles from "./FileHandler";

export default async function registerEvents() {
    const eventFiles = await getAllFiles("events");

    eventFiles.forEach(async (filePath) => {
        const event = await client.importFile(filePath);
        client.on(event.event, event.run);
    });
}

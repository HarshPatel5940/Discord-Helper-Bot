import { Client } from "discord.js";
import loadFiles from "./File-Handler";
import "ascii-table";
async function loadEvents(client: Client) {
    await client.events.clear();

    const FILES = await loadFiles("Events");

    FILES.forEach();
}

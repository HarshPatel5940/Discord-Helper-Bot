import { Client, Collection } from "discord.js";
import { CommandType } from "./Command";
import registerCommands from "../handlers/CommandHandler";
import registerEvents from "../handlers/EventHandler";
require("dotenv").config({ path: ".env.example" });

export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection();
    env: { [key: string]: string | undefined } = process.env;

    constructor() {
        super({ intents: 32767 });
    }

    start() {
        this.registerModules();
        this.login(process.env.BOT_TOKEN);
    }

    async importFile(filePath: string) {
        const importedFile = await import(filePath);
        return importedFile?.default;
    }

    async registerModules() {
        await registerCommands();
        await registerEvents();
    }
}

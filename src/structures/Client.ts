import {
    ApplicationCommandDataResolvable,
    Client,
    Collection,
} from "discord.js";
import { CommandType, RegisterCommandsOptions } from "../types/Command";
import getAllFiles from "../utils/getAllFiles";

export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection();

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
        const slashCommands: ApplicationCommandDataResolvable[] = [];
        const commandFiles = await getAllFiles("commands");
        console.log(commandFiles);

        commandFiles.forEach(async (filePath) => {
            const command: CommandType = await this.importFile(filePath);
            if (!command.name) {
                return console.error(
                    `Command ${filePath} does not have a name!`
                );
            }

            this.commands.set(command.name, command);
            slashCommands.push(command);

            this.on("ready", () => {
                this.registerSlashCommands({
                    commands: slashCommands,
                    guildId: process.env.GUILD_ID,
                });
            });
        });

        const eventFiles = await getAllFiles("events");
        console.log(eventFiles);

        eventFiles.forEach(async (filePath) => {
            const event = await this.importFile(filePath);
            this.on(event.event, event.run);
        });
    }

    async registerSlashCommands({
        commands,
        guildId,
    }: RegisterCommandsOptions) {
        if (guildId) {
            await this.guilds.cache.get(guildId)?.commands.set(commands);
            console.log("Registered slash commands");
        } else {
            await this.application?.commands.set(commands);
            console.log("Registered global slash commands");
        }
    }
}

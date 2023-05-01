import { ApplicationCommandDataResolvable } from "discord.js";
import getAllFiles from "./FileHandler";
import { CommandType, RegisterCommandsOptions } from "../structures/Command";
import { client } from "..";

export default async function registerCommands() {
    const slashCommandsGlobal: ApplicationCommandDataResolvable[] = [];
    const slashCommandsTest: ApplicationCommandDataResolvable[] = [];
    const slashCommands: ApplicationCommandDataResolvable[] = [];
    const commandFiles = await getAllFiles("commands");
    console.log(commandFiles);

    commandFiles.forEach(async (filePath) => {
        const command: CommandType = await client.importFile(filePath);
        if (!command.name) {
            return console.error(`Command ${filePath} does not have a name!`);
        }
        if (command.testOnly) {
            slashCommandsTest.push(command);
            return;
        }

        if (command.permittedGuilds) {
            slashCommands.push(command);
            return;
        }

        client.commands.set(command.name, command);
        slashCommandsGlobal.push(command);
    });

    await registerSlashCommands({ commands: slashCommands, CmdType: "guild" });
    await registerSlashCommands({ commands: slashCommandsTest, CmdType: "test" });
    await registerSlashCommands({ commands: slashCommandsGlobal, CmdType: "global" });
}

async function registerSlashCommands({ commands, CmdType }: RegisterCommandsOptions) {
    if (CmdType === "test") {
        await client.guilds.cache.get(client.env.testGuildId as string)?.commands.set(commands);
        console.log("Registered slash commands for Test Guild");
    } else if (CmdType === "global") {
        await client.application?.commands.set(commands);
        console.log("Registered global slash commands");
    } else {
        let guilds: number[];

        // TODO: Add support for multiple guilds
    }
}

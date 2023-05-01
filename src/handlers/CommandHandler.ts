import { ApplicationCommandDataResolvable } from "discord.js";
import getAllFiles from "./FileHandler";
import { CommandType, RegisterCommandsOptions } from "../structures/Command";
import { client } from "..";

export default async function registerCommands() {
    let slashCommandsGlobal: ApplicationCommandDataResolvable[] = [];
    let slashCommandsTest: ApplicationCommandDataResolvable[] = [];
    const commandFiles = await getAllFiles("commands");

    for (const filePath of commandFiles) {
        const command: CommandType = await client.importFile(filePath);
        if (!command.name) {
            console.error(`Command ${filePath} does not have a name!`);
            continue;
        }
        client.commands.set(command.name, command);

        if (command.testOnly as boolean) {
            slashCommandsTest.push(command);
        } else {
            slashCommandsGlobal.push(command);
        }
    }

    console.log(slashCommandsGlobal, "\n", slashCommandsTest);
    await registerSlashCommands({ commands: slashCommandsTest, CmdInfo: "test" });
    await registerSlashCommands({ commands: slashCommandsGlobal, CmdInfo: "global" });
}

async function registerSlashCommands({ commands, CmdInfo }: RegisterCommandsOptions) {
    if (CmdInfo === "test") {
        let id = client.env.testGuild_ID as string;
        console.log(id);
        await client.guilds.cache.get(id)?.commands.set(commands);
        console.log("Registered slash commands for Test Guild");
    } else if (CmdInfo === "global") {
        await client.application?.commands.set(commands);
        console.log("Registered global slash commands");
    } else {
        console.log("something did not strike right!");
    }
}

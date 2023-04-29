import { CommandInteractionOptionResolver } from "discord.js";
import { client } from "../index";
import { Event } from "../structures/Events";
import { ExtendedInteraction } from "../types/Command";

export default new Event("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    // await interaction.deferReply({ ephemeral: true }).catch(() => {});

    const command = client.commands.get(interaction.commandName);
    if (!command)
        return interaction.followUp({
            content: "Command Does Not Exist. [404]",
        });

    command.run({
        args: interaction.options as CommandInteractionOptionResolver,
        client,
        interaction: interaction as ExtendedInteraction,
    });
});

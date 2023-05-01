import { CommandInteractionOptionResolver } from "discord.js";
import { client } from "../index";
import { Event } from "../structures/Events";
import { ExtendedInteraction } from "../structures/Command";

export default new Event("interactionCreate", async (interaction) => {
    name: "Command Interaction";

    if (!interaction.isCommand()) return;
    // await interaction.deferReply({ ephemeral: true }).catch(() => {});

    const command = client.commands.get(interaction.commandName);
    if (!command)
        return interaction.followUp({
            content: "Command Does Not Exist. [404]",
        });

    command.callback({
        args: interaction.options as CommandInteractionOptionResolver,
        client,
        interaction: interaction as ExtendedInteraction,
    });
});

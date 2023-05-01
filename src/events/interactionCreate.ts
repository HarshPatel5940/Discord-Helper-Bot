import { CommandInteractionOptionResolver } from "discord.js";
import { client } from "../index";
import { Event } from "../structures/Events";
import { ExtendedInteraction } from "../structures/Command";

export default new Event("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);

    if (!command)
        return interaction.followUp({
            content: "Command Does Not Exist. [404]",
        });

    try {
        command.callback({
            args: interaction.options as CommandInteractionOptionResolver,
            client,
            interaction: interaction as ExtendedInteraction,
        });
    } catch (error) {
        console.error(error);
        await interaction.deferReply({ ephemeral: true });
    }
});

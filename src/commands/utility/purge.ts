import { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    description: "It is used to delete multiple messages",
    category: "utility",

    guildOnly: true,

    slash: "both",
    permissions: ["MANAGE_MESSAGES"],

    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "<amount>",

    callback: async ({ message, interaction, channel, args }) => {
        const amount = parseInt(args.shift()!);

        if (message) {
            await message.delete();
        }

        if (interaction) {
            interaction.reply({
                content: "fetching and deleting messsages!!",
                ephemeral: true,
            });
        }

        const messages = await channel.messages.fetch({ limit: amount });
        const { size } = messages;
        messages.forEach((message) => message.delete());

        const emb = new MessageEmbed()
            .setDescription(`:white_check_mark: Deleted ${size} messsages`)
            .setColor("GREEN");

        const msg1 = await channel.send({ embeds: [emb] });

        setTimeout(() => {
            msg1.delete();
        }, 1000 * 5);
    },
} as ICommand;

import DJS, { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: "fun",
    description: "Embed a message",

    slash: "both",

    permissions: ["MANAGE_MESSAGES"],
    guildOnly: true,

    minArgs: 2,
    expectedArgs: "<channel> <text>",

    options: [
        {
            name: "channel",
            description: "Target Channel",
            required: true,
            type: DJS.Constants.ApplicationCommandOptionTypes.CHANNEL,
        },

        {
            name: "text",
            description: "The Message You Want to Echo",
            required: true,
            type: DJS.Constants.ApplicationCommandOptionTypes.STRING,
        },
    ],

    callback: async ({ guild, message, interaction, args }) => {
        const target = message
            ? message.mentions.channels.first()
            : interaction.options.getChannel("channel");

        if (!guild) {
            return {
                custom: true,
                embeds: [
                    new MessageEmbed()
                        .setDescription(
                            "<:Fail:929607022675120239> Please Use this Command within a Server."
                        )
                        .setColor("RED"),
                ],
                ephemeral: true,
            };
        }

        if (!target || target.type !== "GUILD_TEXT") {
            return {
                custom: true,
                embeds: [
                    new MessageEmbed()
                        .setDescription(
                            "<:Fail:929607022675120239> Please Tag a Valid Text Channel."
                        )
                        .setColor("RED"),
                ],
                ephemeral: true,
            };
        }
        args.shift();
        let text = args.join(" ");

        await target.send(text);

        return {
            custom: true,
            embeds: [
                new MessageEmbed()
                    .setDescription(
                        `<:Success:929606936977084427> Message has Been Sent to <#${target.id}>`
                    )
                    .setColor("GREEN"),
            ],
            ephemeral: false,
        };
    },
} as ICommand;

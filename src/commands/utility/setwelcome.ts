import { ICommand } from "wokcommands";
import DJS, { MessageEmbed } from "discord.js";
import welcomeSchema from "../../models/welcome-schema";

export default {
    category: "Config",
    description: "Set's welcome Message in channel.",

    permissions: ["ADMINISTRATOR"],

    minArgs: 2,
    expectedArgs: "<channel> <text>",
    expectedArgsTypes: ["CHANNEL", "STRING"],

    slash: "both",
    guildOnly: true,

    cooldown: "10s",

    options: [
        {
            name: "channel",
            description: "Target Channel",
            required: true,
            type: DJS.Constants.ApplicationCommandOptionTypes.CHANNEL,
        },

        {
            name: "text",
            description: "The Welcome Message",
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
                            "<:Fail:935098896919707700> Please use this command within a server."
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
                            "<:Fail:935098896919707700> Please Tag a Valid Text Channel."
                        )
                        .setColor("RED"),
                ],
                ephemeral: true,
            };
        }
        let text = interaction?.options.getString("text");

        if (message) {
            args.shift();
            text = args.join(" ");
        }

        await welcomeSchema.findOneAndUpdate(
            {
                _id: guild.id,
            },
            {
                _id: guild.id,
                text: text,
                channelId: target.id,
            },
            {
                new: true,
                upsert: true
            }
        );

        return {
            custom: true,
            embeds: [
                new MessageEmbed()
                    .setDescription(
                        "<:Success:935099107163394061> Welcome Channel is setup done!"
                    )
                    .setColor("GREEN"),
            ],
            ephmeral: false,
        };
    },
} as ICommand;

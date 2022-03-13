import { ICommand } from "wokcommands";
import DJS, { MessageEmbed, User } from "discord.js";
import AFK_schema from "../../models/afksystem-schema";

export default {
    description: "Set Your AFK In All Guilds",
    category: "Utility",

    slash: "both",
    guildOnly: true,

    cooldown: "2m",

    minArgs: 1,
    expectedArgs: "<text>",
    expectedArgsTypes: ["STRING"],

    options: [
        {
            name: "text",
            description: "Set Your AFK Message",
            required: true,
            type: DJS.Constants.ApplicationCommandOptionTypes.STRING,
        },
    ],

    callback: async ({ message, interaction, guild, user, text }) => {
        if (!guild) {
            return {
                custom: true,
                embeds: [
                    new MessageEmbed()
                        .setDescription(
                            "<:Fail:935098896919707700> Command Can Only Be Used In A Server"
                        )
                        .setColor("RED"),
                ],
                ephemeral: true,
            };
        }
        let Timestamp = null;

        if (message) {
            Timestamp = message.createdTimestamp;
        } else if (interaction) {
            Timestamp = interaction.createdTimestamp;
        }

        if (!Timestamp)
            return `<:Fail:935098896919707700> Not Able to Find Timestamp `;
        // <t:${parseInt(timestamp1.toString())}:R>

        await AFK_schema.findOneAndUpdate(
            { GuildID: guild.id, UserID: user.id },
            { afkMessage: text, Time: parseInt((Timestamp / 1000).toString()) },
            { new: true, upsert: true }
        );

        return {
            custom: true,
            embeds: [
                new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(
                        `<:Success:935099107163394061> Your Afk Has Been Set Successfully! \n message: ${text}`
                    ),
            ],
            ephemeral: true,
        };
    },
} as ICommand;

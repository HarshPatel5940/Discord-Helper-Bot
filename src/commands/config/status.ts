import DJS, { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: "utility",
    description: "Change the Status of the Bot",

    slash: "both",
    // testOnly: true,

    ownerOnly: true,

    minArgs: 1,
    expectedArgs: "<text>",
    expectedArgsTypes: ["STRING"],

    options: [
        {
            name: "text",
            description: "Used To Set Status",
            required: true,
            type: DJS.Constants.ApplicationCommandOptionTypes.STRING,
        },
    ],

    callback: async ({ client, text }) => {
        client.user?.setPresence({
            status: "dnd",
            activities: [
                {
                    name: text,
                },
            ],
        });

        return {
            custom: true,
            embeds: [
                new MessageEmbed()
                    .setDescription(
                        `<:Success:935099107163394061> Status Chaneged to ${text}`
                    )
                    .setColor("GREEN"),
            ],
            ephmeral: false,
        };
    },
} as ICommand;

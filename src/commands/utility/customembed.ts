/**
                Copyright [2022] [HarshPatel5940]

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License. */

import DJS, { EmbedBuilder } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: "utility",
    description: "Embed a message",
    aliases: ["cemb"],

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
            channelTypes: ["GUILD_TEXT"],
        },
        {
            name: "text",
            description: "Send JSON form of Discord Embeds!!",
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
                    new EmbedBuilder()
                        .setDescription(
                            "❌ Please Use this Command within a Server."
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
                    new EmbedBuilder()
                        .setDescription("❌ Please Tag a Valid Text Channel.")
                        .setColor("RED"),
                ],
                ephemeral: true,
            };
        }
        try {
            args.shift();
            const text1 = args.join(" ");
            const json = JSON.parse(text1);

            const embed = new EmbedBuilder(json);

            await target.send({ embeds: [embed] });
        } catch (e) {
            return `Invalid JSON: ${e}`;
        }

        return {
            custom: true,
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Message Has Been sent to ${target}`)
                    .setColor("GREEN"),
            ],
            ephemeral: false,
        };
    },
} as ICommand;

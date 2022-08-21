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

import { ICommand } from "wokcommands";
import DJS, { MessageEmbed } from "discord.js";

const TYPES = DJS.Constants.ApplicationCommandOptionTypes;

export default {
    name: "slowmode",
    aliases: ["sm", "slow-mode"],
    description: "add slowmode to the channel",
    category: "utility",

    slash: "both",
    guildOnly: true,

    cooldown: "2s",
    permissions: ["MANAGE_MESSAGES"],

    maxArgs: 1,
    minArgs: 1,

    expectedArgs: "<duration>",
    expectedArgsTypes: ["INTEGER"],

    options: [
        {
            name: "duration",
            description: "the amount of SLOWMODE IN SECONDS you want to add",
            type: "INTEGER",
            required: true,
        },
    ],

    callback: async ({ message, interaction, args }) => {
        if (message) {
            if (message.channel.type === "DM") return;
            args.join(" ");

            if (isNaN(Number(args))) {
                await message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(
                                `❌ Please Provide a valid number. convert into seconds!!`
                            )
                            .setColor("RED"),
                    ],
                });

                return;
            }

            await message.channel.setRateLimitPerUser(
                Number(args),
                `slowmode issued by ${message.member?.user.username}`
            );

            return {
                custom: true,
                embeds: [
                    new MessageEmbed()
                        .setDescription(
                            `
✅ Status Changed to ${Number(args)} seconds.

`
                        )
                        .setColor("GREEN"),
                ],
            };
        } else if (interaction) {
            if (!interaction.guild || !interaction.channel) {
                return;
            }
            if (interaction.channel.type === "DM") {
                return;
            }

            const amount1 = interaction.options.getInteger("duration");
            if (!amount1) return "something went wrong in fetching number";

            await interaction.channel.setRateLimitPerUser(
                amount1,
                `slowmode issued by ${interaction.user.username}`
            );
            return {
                custom: true,
                embeds: [
                    new MessageEmbed()
                        .setDescription(
                            `✅ Status Changed to ${amount1} seconds.`
                        )
                        .setColor("GREEN"),
                ],
            };
        }
    },
} as ICommand;

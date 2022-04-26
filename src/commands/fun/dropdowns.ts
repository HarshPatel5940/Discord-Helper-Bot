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

import {
    MessageActionRow,
    MessageSelectMenu,
    MessageEmbed,
    Client,
} from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: "fun",
    description: "Check The Dropdowns in discord",

    testOnly: true,
    slash: "both",
    serverOnly: true,
    Cooldown: "10s",

    init: (client: Client) => {
        client.on("interactionCreate", async (interaction) => {
            if (!interaction.isSelectMenu()) return;
            const { customId, values } = interaction;

            if (customId !== "dropdowns-color") return;
            let value = values[0];
            if (value === "red") {
                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor("RED")
                            .setDescription("You have selected RED"),
                    ],
                    ephemeral: true,
                });
                return;
            } else if (value === "green") {
                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor("GREEN")
                            .setDescription("You have selected GREEN"),
                    ],
                    ephemeral: true,
                });
                return;
            } else if (value === "blue") {
                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor("BLUE")
                            .setDescription("You have selected BLUE"),
                    ],
                    ephemeral: true,
                });
                return;
            }
        });
    },

    callback: async ({ interaction: Msg }) => {
        const row1 = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId("dropdowns-color")
                .setPlaceholder("select any one of the below colour")
                .setMaxValues(1)
                .setMinValues(1)
                .setOptions(
                    [
                        {
                            label: "RED",
                            value: "red",
                            description: "red colour will be selected",
                            emoji: "🔴",
                        },
                    ],
                    [
                        {
                            label: "GREEN",
                            value: "green",
                            description: "green colour will be selected",
                            emoji: "🟢",
                        },
                    ],
                    [
                        {
                            label: "BLUE",
                            value: "blue",
                            description: "blue colour will be selected",
                            emoji: "🔵",
                        },
                    ]
                )
        );

        Msg.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(0x00ff00)
                    .setDescription("Please Choose a Colour from below"),
            ],
            components: [row1],
            ephemeral: true,
        });
    },
} as ICommand;

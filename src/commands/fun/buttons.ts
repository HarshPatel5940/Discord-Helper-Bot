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

import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    name: "fun-buttons",
    category: "fun",
    description: "Check The Buttons in discord",

    slash: true,
    Cooldown: "10s",

    guildOnly: true,

    callback: async ({ interaction: msgInt, channel }) => {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("Primary")
                    .setLabel("primary")
                    .setStyle("PRIMARY")
            )

            .addComponents(
                new MessageButton()
                    .setCustomId("Secondary")
                    .setLabel("Secondary")
                    .setStyle("SECONDARY")
            )

            .addComponents(
                new MessageButton()
                    .setCustomId("Sucess")
                    .setLabel("Sucess")
                    .setStyle("SUCCESS")
            )

            .addComponents(
                new MessageButton()
                    .setCustomId("Danger")
                    .setLabel("Danger")
                    .setStyle("DANGER")
            )

            .addComponents(
                new MessageButton()
                    .setURL("https://www.google.com")
                    .setLabel("google")
                    .setStyle("LINK")
            );

        await msgInt.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription("Choose one of the Buttons")
                    .setColor("BLURPLE"),
            ],
            components: [row],
            ephemeral: true,
        });

        const collector = channel.createMessageComponentCollector({
            max: 1,
        });

        collector.on("end", async (collection) => {
            if (collection.first()?.customId === "Primary") {
                await msgInt.followUp({
                    content: "You Choosed Primary Button",
                    ephemeral: true,
                });
            } else if (collection.first()?.customId === "Secondary") {
                await msgInt.followUp({
                    content: "You Choosed Secondary Button",
                    ephemeral: true,
                });
            } else if (collection.first()?.customId === "Success") {
                await msgInt.followUp({
                    content: "You Choosed Success Button",
                    ephemeral: true,
                });
            } else if (collection.first()?.customId === "Danger") {
                await msgInt.followUp({
                    content: "You Choosed Danger Button",
                    ephemeral: true,
                });
            }

            msgInt.editReply({
                components: [],
            });
        });
    },
} as ICommand;

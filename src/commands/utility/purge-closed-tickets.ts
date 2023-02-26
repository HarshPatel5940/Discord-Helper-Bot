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
import DJS, { MessageActionRow, MessageButton, EmbedBuilder } from "discord.js";

const TYPES = DJS.Constants.ApplicationCommandOptionTypes;

export default {
    category: "utility",
    description: "It will repeat the message in all the channels of a category",

    slash: true,
    guildOnly: true,
    permissions: ["ADMINISTRATOR"],

    cooldown: "5s",

    callback: async ({ interaction }) => {
        if (!interaction || !interaction.guild || !interaction.channel) return;

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("closed-tickets-delete")
                .setLabel("Delete Closed Tickets.")
                .setStyle("DANGER")
        );

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("CLOSED TICKETS DELETION PANEL")
                    .setColor("RED")
                    .setDescription(
                        `
This command will delete any channels starting with \`tc-\`

> **__NOTE__**: You will need to change ur **closed ticket settings** to \`tc- something\` so we will able to detect it has a closed ticket and delete it.

Click The Button Below To Start The Deletion Proccess.
`
                    ),
            ],
            components: [row],
            ephemeral: false,
        });

        const collector = interaction.channel.createMessageComponentCollector({
            max: 1,
        });

        collector.on("end", async (collection: any) => {
            if (collection.first()?.customId === "closed-tickets-delete") {
                await interaction.deleteReply();

                if (!interaction || !interaction.guild) {
                    return;
                }

                interaction.guild.channels.cache.forEach((ch) => {
                    if (!ch.name.startsWith("tc-")) {
                        return;
                    }
                    if (ch?.type !== "GUILD_TEXT") {
                        return;
                    }

                    setTimeout(async () => {
                        await ch.delete();
                    }, 100);
                });

                interaction.channel?.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("GREEN")
                            .setDescription(
                                `✅ Successfully Deleted Closed Tickets`
                            )
                            .setFooter({
                                text: `User ID: ${interaction.member?.user.id}`,
                            }),
                    ],
                });
            }
        });
    },
} as ICommand;

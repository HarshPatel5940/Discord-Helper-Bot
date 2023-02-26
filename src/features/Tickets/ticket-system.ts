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
    EmbedBuilder,
    Client,
    MessageActionRow,
    MessageButton,
} from "discord.js";

import TicketSystemSchema from "../../models/ticketsystem-schema";
import TicketConfigSchema from "../../models/ticketconfig-schema";
import { createTranscript } from "discord-html-transcripts";

export default (client: Client) => {
    client.on("interactionCreate", async (ButtonInteraction) => {
        if (!ButtonInteraction.isButton()) return;
        const { channel, guild, member, customId } = ButtonInteraction;

        if (!guild) return;
        if (!member) return;
        if (!channel) return;
        if (!ButtonInteraction.inCachedGuild()) return;
        if (channel.type !== "GUILD_TEXT") return;

        const sysData = await TicketSystemSchema.findById(channel.id);
        if (!sysData) return;

        const configData = await TicketConfigSchema.findById(guild.id);
        if (!configData) return;

        if (
            ![
                "ticket-close",
                "ticket-close-confirm",
                "ticket-delete",
                "ticket-reopen",
            ].includes(customId)
        )
            return;

        TicketSystemSchema.findOne(
            { ChannelID: channel.id },
            async (
                err: any,
                docs: {
                    Locked: boolean;
                    MembersID: any;
                    Closed: boolean;
                    TicketCount: any;
                    GuildID: any;
                }
            ) => {
                if (err) throw err;
                if (!docs) {
                    return await ButtonInteraction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("RED")
                                .setDescription(
                                    "❌ No Data Was Found about this Channel, Delete/close it Manually!"
                                ),
                        ],
                    });
                }

                switch (customId) {
                    case "ticket-close":
                        if (docs.Closed == true) {
                            const row1 = new MessageActionRow();
                            row1.addComponents(
                                new MessageButton()
                                    .setCustomId("ticket-reopen")
                                    .setLabel("Reopen Ticket")
                                    .setEmoji("🔄")
                                    .setStyle("SUCCESS"),

                                new MessageButton()
                                    .setCustomId("ticket-delete")
                                    .setLabel("Delete Ticket")
                                    .setEmoji("✅")
                                    .setStyle("DANGER")
                            );
                            await ButtonInteraction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor("RED")
                                        .setDescription(
                                            `❌ Ticket is already closed. `
                                        ),
                                ],
                                components: [row1],
                                ephemeral: true,
                            });
                            return;
                        }

                        const row = new MessageActionRow();
                        row.addComponents(
                            new MessageButton()
                                .setCustomId("ticket-close-confirm")
                                .setLabel("Close")
                                .setEmoji("✔️")
                                .setStyle("PRIMARY")
                        );

                        await ButtonInteraction.reply({
                            content: `${ButtonInteraction.member}`,
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription(
                                        "Are you sure you want to close this ticket?"
                                    )
                                    .setColor("RED"),
                            ],
                            components: [row],
                        });

                        const Msg1 = await ButtonInteraction.fetchReply();

                        const collector =
                            channel.createMessageComponentCollector({
                                max: 1,
                            });

                        collector.on("end", async (collection) => {
                            if (
                                collection.first()?.customId ===
                                "ticket-close-confirm"
                            ) {
                                channel.permissionOverwrites.edit(
                                    sysData.MembersID,
                                    {
                                        VIEW_CHANNEL: false,
                                    }
                                );

                                Msg1.delete();

                                const row1 = new MessageActionRow();
                                row1.addComponents(
                                    new MessageButton()
                                        .setCustomId("ticket-reopen")
                                        .setLabel("Reopen Ticket")
                                        .setEmoji("🔄")
                                        .setStyle("SUCCESS"),

                                    new MessageButton()
                                        .setCustomId("ticket-delete")
                                        .setLabel("Delete Ticket")
                                        .setEmoji("✅")
                                        .setStyle("DANGER")
                                );

                                await ButtonInteraction.followUp({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor("GREEN")
                                            .setDescription(
                                                `✅ Ticket Closed Successfully!`
                                            ),
                                    ],
                                    components: [row1],
                                });

                                await TicketSystemSchema.updateOne(
                                    { ChannelID: channel.id },
                                    { Closed: true }
                                );
                            }
                        });

                        break;

                    case "ticket-reopen":
                        if (docs.Closed == false) {
                            await ButtonInteraction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor("RED")
                                        .setDescription(
                                            "❌ The Ticket is already Open."
                                        ),
                                ],
                                ephemeral: true,
                            });
                            return;
                        }
                        channel.permissionOverwrites.edit(sysData.MembersID, {
                            VIEW_CHANNEL: true,
                        });

                        await TicketSystemSchema.updateOne(
                            { ChannelID: channel.id },
                            { Closed: false }
                        );
                        await ButtonInteraction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("GREEN")
                                    .setDescription(
                                        `✅ Ticket Reopened Successfully!`
                                    ),
                            ],
                        });
                        break;
                    case "ticket-delete":
                        if (docs.Closed == false) {
                            await ButtonInteraction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor("RED")
                                        .setDescription(
                                            "❌ *PLEASE CLOSE this ticket first!!*"
                                        ),
                                ],
                                ephemeral: true,
                            });
                            return;
                        }
                        await ButtonInteraction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("GREEN")
                                    .setDescription(
                                        `✅ Ticket Deletion has been started!`
                                    ),
                            ],
                        });
                        const attachment = await createTranscript(channel, {
                            limit: -1,
                            returnBuffer: false,
                            fileName: `${channel.name}.html`,
                        });

                        const TChannel = await guild.channels.fetch(
                            configData.TranscriptID
                        );

                        if (!TChannel) return;
                        if (TChannel.type !== "GUILD_TEXT") return;

                        const user1 = await guild.members.fetch(
                            sysData.MembersID
                        );

                        try {
                            await TChannel.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor("GREEN")
                                        .setTitle(
                                            `Name: ${channel.name} | ID: ${channel.id}`
                                        )
                                        .setDescription(
                                            `✅ Channel Closed by ${member} `
                                        ),
                                ],
                                files: [attachment],
                            });

                            await user1.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor("GREEN")
                                        .setTitle(
                                            `✅ Your Ticket has been Closed!`
                                        )
                                        .setDescription(
                                            `
                                            # Channel name: #${channel.name} | ${channel.id}
                                            # Server name: ${guild.name} | ${guild.id}
                                            `
                                        ),
                                ],
                                files: [attachment],
                            });
                        } catch (e) {
                            console.log(e);
                        }

                        await TicketSystemSchema.deleteOne({
                            _id: channel.id,
                        });

                        channel.delete();

                        break;
                }
            }
        );
    });
};
export const config = {
    displayName: "CLOSE A TICKET",
    dbName: "TICKET_CLOSE",
};

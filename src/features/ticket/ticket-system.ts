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
    MessageEmbed,
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
                    return ButtonInteraction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor("RED")
                                .setDescription(
                                    "<:Fail:935098896919707700> No Data Was Found about this Channel, Delete/close it Manually!"
                                ),
                        ],
                    });
                }

                switch (customId) {
                    case "ticket-close":
                        if (docs.Closed == true) {
                            ButtonInteraction.reply({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor("RED")
                                        .setDescription(
                                            "<:Fail:935098896919707700> The Ticket is already Closed."
                                        ),
                                ],
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

                        ButtonInteraction.reply({
                            content: `${ButtonInteraction.member}`,
                            embeds: [
                                new MessageEmbed()
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

                                ButtonInteraction.followUp({
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor("GREEN")
                                            .setDescription(
                                                `<:Success:935099107163394061> Ticket Closed Successfully!`
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

                        setTimeout(async () => {
                            try {
                                Msg1.delete();
                            } catch (err) {}
                        }, 30 * 1000);

                        break;

                    case "ticket-reopen":
                        if (docs.Closed == false) {
                            ButtonInteraction.reply({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor("RED")
                                        .setDescription(
                                            "<:Fail:935098896919707700> The Ticket is already Open."
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
                        ButtonInteraction.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setColor("GREEN")
                                    .setDescription(
                                        `<:Success:935099107163394061> Ticket Reopened Successfully!`
                                    ),
                            ],
                        });
                        break;
                    case "ticket-delete":
                        if (docs.Closed == false) {
                            ButtonInteraction.reply({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor("RED")
                                        .setDescription(
                                            "<:Fail:935098896919707700> *PLEASE CLOSE this ticket first!!*"
                                        ),
                                ],
                                ephemeral: true,
                            });
                            return;
                        }
                        ButtonInteraction.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setColor("GREEN")
                                    .setDescription(
                                        `<:Success:935099107163394061> Ticket Deletion has been started!`
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
                            TChannel.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor("GREEN")
                                        .setTitle(
                                            `Name: ${channel.name} | ID: ${channel.id}`
                                        )
                                        .setDescription(
                                            `<:Success:935099107163394061> Channel Closed by ${member} `
                                        ),
                                ],
                                files: [attachment],
                            });

                            user1.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor("GREEN")
                                        .setTitle(
                                            `<:Success:935099107163394061> Your Ticket has been Closed!`
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

                        setTimeout(async () => {
                            await channel.delete();
                        }, 5 * 1000);

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

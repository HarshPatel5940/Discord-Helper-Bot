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
    Interaction,
    GuildAuditLogsEntry,
} from "discord.js";

import TicketSystemSchema from "../../models/ticketsystem-schema";
import TicketConfigSchema from "../../models/ticketconfig-schema";
import { createTranscript } from "discord-html-transcripts";
import ticketsystemSchema from "../../models/ticketsystem-schema";
import timeout from "../../commands/moderation/timeout";

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
            !["ticket-close", "ticket-lock", "ticket-unlock"].includes(customId)
        )
            return;

        if (
            !ButtonInteraction.member.roles.cache.find(
                (r) => r.id === configData.SupportRoleID
            )
        ) {
            return ButtonInteraction.reply({
                content:
                    "You Cannot Use these Buttons!! | **SUPPORT STAFF ROLE CAN ONLY USE THESE**",
                ephemeral: true,
            });
        }
        const Embed = new MessageEmbed().setColor("BLURPLE");

        TicketSystemSchema.findOne(
            { ChannelID: channel.id },
            async (
                err: any,
                docs: {
                    Locked: boolean;
                    MembersID: any[];
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

                if (!docs.MembersID || docs.MembersID === undefined)
                    return console.log(
                        "something went wrong with insertion in database"
                    );

                switch (customId) {
                    case "ticket-lock":
                        if (docs.Locked == true) {
                            return ButtonInteraction.reply({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor("RED")
                                        .setDescription(
                                            "<:Fail:935098896919707700> The Ticket is already Locked."
                                        ),
                                ],
                                ephemeral: true,
                            });
                        }

                        await TicketSystemSchema.updateOne(
                            { ChannelID: channel.id },
                            { Locked: true }
                        );
                        Embed.setDescription(
                            `🔒 This Ticket is Now Locked by ${member}`
                        );

                        channel.permissionOverwrites.edit(
                            configData.EveryoneRoleID,
                            {
                                SEND_MESSAGES: false,
                            }
                        );
                        ButtonInteraction.reply({ embeds: [Embed] });
                        break;

                    case "ticket-unlock":
                        if (docs.Locked == false) {
                            return ButtonInteraction.reply({
                                ephemeral: true,
                                embeds: [
                                    new MessageEmbed()
                                        .setColor("RED")
                                        .setDescription(
                                            "<:Fail:935098896919707700> The Ticket is already Unlocked."
                                        ),
                                ],
                            });
                        }

                        await TicketSystemSchema.updateOne(
                            { ChannelID: channel.id },
                            { Locked: false }
                        );
                        Embed.setDescription(
                            `🔒 This Ticket is Now Unlocked by ${member}`
                        );

                        channel.permissionOverwrites.edit(
                            configData.EveryoneRoleID,
                            {
                                SEND_MESSAGES: true,
                            }
                        );

                        ButtonInteraction.reply({ embeds: [Embed] });
                        break;
                    case "ticket-close":
                        if (docs.Closed == true) {
                            docs.Closed = true;
                            ButtonInteraction.reply({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor("RED")
                                        .setDescription(
                                            "<:Fail:935098896919707700> The Ticket was already Closed. (Unlocking it)"
                                        ),
                                ],
                            });

                            await TicketSystemSchema.updateOne(
                                { ChannelID: channel.id },
                                { Closed: false }
                            );

                            return;
                        }

                        Embed.setTitle(
                            "This Channel Will Be Deleted Shortly | You can reopen ticket if you want"
                        );

                        Embed.setDescription(
                            `🔒 This Ticket is Locked by ${member}`
                        );

                        const row = new MessageActionRow().addComponents(
                            new MessageButton()
                                .setCustomId("ticket-reopen")
                                .setLabel("Reopen Ticket 🔓")
                                .setStyle("SUCCESS")
                        );

                        ButtonInteraction.reply({
                            content: `${ButtonInteraction.member}`,
                            embeds: [Embed],
                            components: [row],
                        });

                        channel.permissionOverwrites.edit(
                            configData.EveryoneRoleID,
                            {
                                SEND_MESSAGES: true,
                            }
                        );

                        const Msg1 = await ButtonInteraction.fetchReply();

                        const ST = setTimeout(async () => {
                            const attachment = await createTranscript(channel, {
                                limit: -1,
                                returnBuffer: false,
                                fileName: `${channel.name}.html`,
                            });
                            await TicketSystemSchema.updateOne(
                                { ChannelID: channel.id },
                                { Closed: true }
                            );

                            const TChannel = await guild.channels.fetch(
                                configData.TranscriptID
                            );

                            if (!TChannel) return;
                            if (TChannel.type !== "GUILD_TEXT") return;

                            Embed.setTitle(
                                `Name: ${channel.name} | ID: ${channel.id}`
                            );
                            Embed.setDescription(
                                "<:Success:935099107163394061> Channel Closed by " +
                                    member
                            );
                            Embed.setColor("GREEN");

                            TChannel.send({
                                embeds: [Embed],
                                files: [attachment],
                            });

                            ticketsystemSchema.findOneAndDelete({
                                ChannelID: channel.id,
                            });
                            channel.delete();
                        }, 15 * 1000);

                        const collector =
                            channel.createMessageComponentCollector({
                                max: 1,
                            });

                        collector.on("end", async (collection) => {
                            if (
                                collection.first()?.customId === "ticket-reopen"
                            ) {
                                ButtonInteraction.followUp({
                                    ephemeral: true,
                                    content:
                                        "Reopening Ticket/Close Action Cancelled",
                                });
                                Msg1.delete();

                                clearTimeout(ST);
                            }
                        });
                }
            }
        );
    });
};
export const config = {
    displayName: "CLOSE A TICKET",
    dbName: "TICKET_CLOSE",
};

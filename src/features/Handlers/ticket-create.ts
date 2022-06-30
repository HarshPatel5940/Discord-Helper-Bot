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
    MessageActionRow,
    MessageButton,
    Client,
} from "discord.js";

import TicketConfigSchema from "../../models/ticketconfig-schema";
import TicketSystemSchema from "../../models/ticketsystem-schema";

export default (client: Client) => {
    client.on("interactionCreate", async (ButtonInteraction) => {
        if (!ButtonInteraction.isButton()) return;
        const { guild, member, customId } = ButtonInteraction;

        if (!guild) return;
        if (!member) return;

        const Data = await TicketConfigSchema.findById(guild.id);
        let {
            EveryoneRoleID,
            SupportRoleID,
            OpenCategoryID,
            GuildTicketCount,
            ButtonsName,
        } = Data;
        if (!Data) return;

        if (!customId.startsWith("ticket-create")) return;

        let label1 = "";
        try {
            const id1 = customId.slice(customId.length - 1);
            label1 = ButtonsName[id1];
        } catch (err) {
            console.log("Ticket Create ERROR: -->", err);
        }

        ButtonInteraction.reply({
            content: "creating ticket...",
            ephemeral: true,
        });

        await guild.channels
            .create(`${label1}-Ticket-${GuildTicketCount}`, {
                type: "GUILD_TEXT",
                reason: `Ticket Created by: ${member.user.username} | id= ${member.user.id}`,
                parent: OpenCategoryID,
                permissionOverwrites: [
                    {
                        id: member.user.id,
                        allow: [
                            "VIEW_CHANNEL",
                            "READ_MESSAGE_HISTORY",
                            "ATTACH_FILES",
                            "EMBED_LINKS",
                        ],
                    },
                    {
                        id: EveryoneRoleID,
                        deny: ["VIEW_CHANNEL"],
                    },
                    {
                        id: SupportRoleID,
                        allow: [
                            "SEND_MESSAGES",
                            "VIEW_CHANNEL",
                            "READ_MESSAGE_HISTORY",
                            "ATTACH_FILES",
                            "MANAGE_MESSAGES",
                            "MENTION_EVERYONE",
                        ],
                    },
                ],
            })
            .then(async (channel) => {
                const Embed = new MessageEmbed()
                    .setColor("BLURPLE")
                    .setTitle(`${member.user.username} | ${label1} Ticket `)
                    .setDescription(
                        `
Ticket Created by <@${member.user.id}> | \`${member.user.id}\`
Ticket Category: ${label1}

**Please Wait patiently for a response from Staff/Support Team!**`
                    )
                    .setFooter({ text: `Ticket Count: ${GuildTicketCount}` });

                const Buttons = new MessageActionRow();
                Buttons.addComponents(
                    new MessageButton()
                        .setCustomId("ticket-close")
                        .setLabel("Close Ticket")
                        .setEmoji("⛔")
                        .setStyle("SECONDARY")
                );
                const msg1 = await channel.send({
                    content: `<@&${SupportRoleID}> | <@${member.user.id}> Your Ticket Has Been Created!`,
                    embeds: [Embed],
                    components: [Buttons],
                });

                let NewTicketCount = (
                    parseInt(GuildTicketCount) + 1
                ).toString();
                await TicketConfigSchema.findByIdAndUpdate(
                    { _id: guild.id },
                    { GuildTicketCount: NewTicketCount },
                    { upsert: true, new: true }
                );

                await TicketSystemSchema.create({
                    _id: channel.id,
                    GuildID: guild.id,
                    MembersID: member.user.id,
                    ChannelID: channel.id,
                    Closed: false,
                });
                ButtonInteraction.editReply({
                    content: `:white_check_mark: Created Ticket Channel ${channel}`,
                });
                msg1.pin();
            });
    });
};

export const config = {
    displayName: "CREATE A TICKET",
    dbName: "TICKET_CREATE",
};

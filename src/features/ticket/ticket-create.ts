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

        const Data = await TicketConfigSchema.findOne({ GuildId: guild.id });
        if (!Data) return;

        if (!Data.Buttons.includes(customId)) return;

        let TicketCount = Data.GuildTicketCount;

        ButtonInteraction.reply({content: 'creating ticket...', ephemeral:true});

        await guild.channels
            .create(`${customId}-Ticket-${TicketCount}`, {
                type: "GUILD_TEXT",
                reason: `Ticket Created by: ${member.user.username} | id= ${member.user.id}`,
                parent: Data.OpenCategoryID,
                permissionOverwrites: [
                    {
                        id: member.user.id,
                        allow: [
                            "SEND_MESSAGES",
                            "VIEW_CHANNEL",
                            "READ_MESSAGE_HISTORY",
                            "ATTACH_FILES",
                        ],
                    },
                    {
                        id: Data.EveryoneRoleID,
                        deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                    },
                    {
                        id: Data.SupportRoleID,
                        allow: [
                            "SEND_MESSAGES",
                            "VIEW_CHANNEL",
                            "READ_MESSAGE_HISTORY",
                            "ATTACH_FILES",
                            "MANAGE_MESSAGES",
                        ],
                    },
                ],
            })
            .then(async (channel) => {
                const Embed = new MessageEmbed()
                    .setColor("BLURPLE")
                    .setTitle(`${member.user.username} Ticket | ${customId}`)
                    .setDescription(
                        `Ticket Created by <@${member.user.id}>
                Member Id: \`${member.user.id}\`
                Ticket Category: ${customId}

                **Please Wait patiently for a response from Staff/Support Team!**`
                    )
                    .setFooter({ text: `Ticket Count: ${TicketCount}` });

                const Buttons = new MessageActionRow();
                Buttons.addComponents(
                    new MessageButton()
                        .setCustomId("ticket-close")
                        .setLabel("Save & Delete")
                        .setEmoji("⛔")
                        .setStyle("SUCCESS"),
                    new MessageButton()
                        .setCustomId("ticket-lock")
                        .setLabel("lock")
                        .setEmoji("🔒")
                        .setStyle("SECONDARY"),
                    new MessageButton()
                        .setCustomId("ticket-unlock")
                        .setLabel("unlock")
                        .setEmoji("🔓")
                        .setStyle("SECONDARY")
                );
                const msg1 = await channel.send({
                    content: `<@${member.user.id}> Your Ticket Has Been Created!`,
                    embeds: [Embed],
                    components: [Buttons],
                });

                TicketCount = (parseInt(TicketCount) + 1).toString();
                await TicketConfigSchema.findOneAndUpdate(
                    { GuildID: guild.id },
                    { GuildTicketCount: TicketCount },
                    { upsert: true }
                );

                await TicketSystemSchema.create({
                    GuildID: guild.id,
                    MembersID: member.user.id,
                    ChannelID: channel.id,
                    Closed: false,
                    Locked: false,
                });
                ButtonInteraction.editReply({
                    content: `Created Ticket Channel ${channel}`,
                });
                msg1.pin();
            });
    });
};

export const config = {
    displayName: "CREATE A TICKET",
    dbName: "TICKET_CREATE",
};

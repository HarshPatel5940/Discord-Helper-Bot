import DJS, {
    ButtonInteraction,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    Client,
    Interaction,
} from "discord.js";

import TicketConfigSchema from "../models/ticketconfig-schema";
import TicketSystemSchema from "../models/ticketsystem-schema";

export default (client: Client) => {
    client.on("interactionCreate", async (ButtonInteraction) => {
        if (!ButtonInteraction.isButton()) return;
        const { guild, member, customId } = ButtonInteraction;

        if (!guild) return;
        if (!member) return;

        const Data = await TicketConfigSchema.findOne({ guildId: guild.id });
        if (!Data) return;

        if (!Data.Buttons.includes(customId)) return;

        let TicketCount = Data.GuildTicketCount;

        await guild.channels
            .create(`${customId}-Ticket-${TicketCount}`, {
                type: "GUILD_TEXT",
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
                        deny: ["VIEW_CHANNEL"],
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
                ButtonInteraction.reply({
                    content: `${member} your ticket has been created! ${channel}`,
                    ephemeral: true,
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
                        .setCustomId("close")
                        .setLabel("Save & Close")
                        .setEmoji("💾")
                        .setStyle("SUCCESS"),
                    new MessageButton()
                        .setCustomId("lock")
                        .setLabel("lock")
                        .setEmoji("🔒")
                        .setStyle("SECONDARY"),
                    new MessageButton()
                        .setCustomId("unlock")
                        .setLabel("unlock")
                        .setEmoji("🔓")
                        .setStyle("SECONDARY")
                );

                channel.send({
                    content: `<@${member.user.id}> Your Ticket Has Been Created!`,
                    embeds: [Embed],
                    components: [Buttons],
                });
            });
    });
};

export const config = {
    displayName: "CREATE A TICKET",
    dbName: "TICKET_CREATE",
};

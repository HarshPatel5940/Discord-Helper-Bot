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
import DJS, {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    Message,
    WebhookClient,
} from "discord.js";
import TicketConfigSchema from "../../models/ticketconfig-schema";

const TYPES = DJS.Constants.ApplicationCommandOptionTypes;

export default {
    category: "config",
    description: "Setup Ticket System For Your Server!",

    slash: true,
    guildOnly: true,

    cooldown: "10s",
    permissions: ["ADMINISTRATOR"],

    options: [
        {
            name: "channel",
            description: "Select the Ticket Creation Channel",
            required: true,
            type: TYPES.CHANNEL,
            channelTypes: ["GUILD_TEXT"],
        },
        {
            name: "transcript",
            description: "Select the Transcript Channel",
            required: true,
            type: TYPES.CHANNEL,
            channelTypes: ["GUILD_TEXT"],
        },
        {
            name: "tickets-category",
            description:
                "Select the Category in which Open Tickets will be Created.",
            required: true,
            type: TYPES.CHANNEL,
            channelTypes: ["GUILD_CATEGORY"],
        },
        {
            name: "supportrole",
            description: "Provide the Ticket Support's Role",
            required: true,
            type: TYPES.ROLE,
        },
        {
            name: "everyonerole",
            description: "Provide the @everyone role. IT'S IMPORTANT!!!",
            required: true,
            type: TYPES.ROLE,
        },
        {
            name: "embed-title",
            description: "Provide the Title of Ticket Panel",
            required: true,
            type: TYPES.STRING,
        },
        {
            name: "greenbutton",
            description:
                "Give Your First Button (Success Style) | name and an emoji by adding a comma | SYNTAX: NAME,EMOJI",
            required: true,
            type: TYPES.STRING,
        },
        {
            name: "bluebutton",
            description:
                "Give Your Second Button (Primary Style) | name and an emoji by adding a comma | SYNTAX: NAME,EMOJI",
            required: false,
            type: TYPES.STRING,
        },
        {
            name: "redbutton",
            description:
                "Give Your Third Button (Danger Style)| name and an emoji by adding a comma | SYNTAX: NAME,EMOJI",
            required: false,
            type: TYPES.STRING,
        },
    ],

    callback: async ({ interaction }) => {
        if (!interaction) return;

        await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(
                        `
                    ⁉️ **DO YOU NEED OUR HELP?**
                    If you have any questions or need further information that can not be found inside our project,
                    do not hesitate to reach our team by creating a ticket.

                    **🤯 WHERE IS MY TICKET?**
                    *We close your ticket for the following reasons:*
                    🔸 Your question is not asked when creating the ticket
                    🔸 You didn't reply to our response for 24 hours
                    🔸 Your issue is resolved

                    create a ticket under a appropriate category by clicking one of the buttons below.
                                    `
                    )
                    .addField(
                        "This is the default description of ticket panel",
                        'Reply With "**default**" to use this or just send the custom description you want to have',
                        false
                    ),
            ],
            ephemeral: true,
        });

        const { guild, options, channel } = interaction;

        // interaction.deferReply({ ephemeral: true });

        if (!guild || !channel) {
            return {
                custom: true,
                embeds: [
                    new MessageEmbed()
                        .setDescription(
                            "❌ Please use this command within a server and text channel"
                        )
                        .setColor("RED"),
                ],
                ephemeral: true,
            };
        }

        try {
            const Channel = options.getChannel("channel");
            const Transcript = options.getChannel("transcript");
            const OpenTicketsCategory = options.getChannel("tickets-category");
            const SupportRole = options.getRole("supportrole");
            const EveryoneRole = options.getRole("everyonerole");
            const TitleMsg = options.getString("embed-title");
            let DescriptionMsg = `
                ⁉️ **DO YOU NEED OUR HELP?**
If you have any questions or need further information that can not be found inside our project,
do not hesitate to reach our team by creating a ticket.

**🤯 WHERE IS MY TICKET?**
*We close your ticket for the following reasons:*
🔸 Your question is not asked when creating the ticket
🔸 You didn't reply to our response for 24 hours
🔸 Your issue is resolved

create a ticket under a appropriate category by clicking one of the buttons below.
                `;
            let CDescriptionMsg = "default";

            const rawButton1 = options.getString("greenbutton");
            const rawButton2 = options.getString("bluebutton");
            const rawButton3 = options.getString("redbutton");

            if (!rawButton1) {
                return {
                    custom: true,
                    embeds: [
                        new MessageEmbed()

                            .setDescription(
                                "❌ Please Provide Name and Id for Atleast Button 1"
                            )
                            .setColor("RED"),
                    ],
                    ephemeral: true,
                };
            }

            if (
                !Channel ||
                !Transcript ||
                !OpenTicketsCategory ||
                !SupportRole ||
                !EveryoneRole ||
                !TitleMsg
            ) {
                return {
                    custom: true,
                    embeds: [
                        new MessageEmbed()

                            .setDescription(
                                "❌ Please provide all the required fields."
                            )
                            .setColor("RED"),
                    ],
                    ephemeral: true,
                };
            }

            let Button2 = ["none", "none"];
            let Button3 = ["none", "none"];

            const Button1 = rawButton1.split(",");
            if (rawButton2 !== null) {
                Button2 = rawButton2.split(",");
            }
            if (rawButton3) {
                Button3 = rawButton3.split(",");
            }

            const Buttons = new MessageActionRow();
            Buttons.addComponents(
                new MessageButton()
                    .setCustomId("ticket-create-0")
                    .setLabel(Button1[0])
                    .setStyle("SUCCESS")
                    .setEmoji(Button1[1])
            );

            if (Button2[0] !== "none") {
                Buttons.addComponents(
                    new MessageButton()
                        .setCustomId("ticket-create-1")
                        .setLabel(Button2[0])
                        .setStyle("PRIMARY")
                        .setEmoji(Button2[1])
                );
            }

            if (Button3[0] !== "none") {
                Buttons.addComponents(
                    new MessageButton()
                        .setCustomId("ticket-create-2")
                        .setLabel(Button3[0])
                        .setStyle("DANGER")
                        .setEmoji(Button3[1])
                );
            }

            const collector = channel.createMessageCollector({
                filter: (m: Message) =>
                    m.member?.user.id === interaction.user.id,
                max: 1,
                time: 10000 * 60 * 2,
            });

            collector.on("collect", async (message) => {
                CDescriptionMsg = message.content;

                if (CDescriptionMsg !== "default") {
                    DescriptionMsg = CDescriptionMsg;
                }

                const Embed = new MessageEmbed()
                    .setTitle(TitleMsg)
                    .setDescription(DescriptionMsg)
                    .setColor("#0099ff");

                let icon = guild.iconURL()?.toString();
                if (icon) Embed.setThumbnail(icon);

                if (Channel.type === "GUILD_TEXT") {
                    await Channel.createWebhook(`${guild.name} Tickets`, {
                        avatar: guild.iconURL()?.toString(),
                        reason: `Ticket Setup Cmd by ${interaction.user.tag}`,
                    }).then(async (webhook) => {
                        const wc123 = new WebhookClient({ url: webhook.url });
                        await wc123.send({
                            embeds: [Embed],
                            components: [Buttons],
                        });

                        await webhook.delete();
                    });
                }
                await interaction.editReply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription("✅ saving configuration...")
                            .setColor("GREEN"),
                    ],
                });

                await TicketConfigSchema.findOneAndUpdate(
                    { _id: guild.id },
                    {
                        _id: guild.id,
                        GuildID: guild.id,
                        GuildTicketCount: "1",
                        ChannelID: Channel.id,
                        TranscriptID: Transcript.id,
                        OpenCategoryID: OpenTicketsCategory.id,
                        EveryoneRoleID: EveryoneRole.id,
                        SupportRoleID: SupportRole.id,
                        Title: TitleMsg,
                        Description: DescriptionMsg,
                        ButtonsName: [Button1[0], Button2[0], Button3[0]],
                        ButtonsEmoji: [Button1[1], Button2[1], Button3[1]],
                    },
                    {
                        new: true,
                        upsert: true,
                    }
                );

                await interaction.editReply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription("✅ Ticket System Setup Done!!")
                            .setColor("GREEN"),
                    ],
                    // ephemeral: true,
                });

                await message.delete();
            });
        } catch (err) {
            console.log(err);
            return {
                custom: true,
                embeds: [
                    new MessageEmbed()
                        .setDescription(
                            `
❌ **__AN ERROR OCCURRED__ While Setting Up Your Ticket System**
1) Make Sure None of your Buttons Names are Duplicated!
2) Make Sure you use the **FORMAT** => name,emoji
3) Make Sure Buttons Names are not more than 100 characters
4) Make Sure button Emojis, are Actually Accessible Emojis!!
                    `
                        )
                        .setColor("RED"),
                ],
            };
        }
    },
} as ICommand;

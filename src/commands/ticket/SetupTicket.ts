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
import DJS, { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import TicketConfigSchema from "../../models/ticketconfig-schema";

const TYPES = DJS.Constants.ApplicationCommandOptionTypes;

export default {
    category: "ticket",
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
            name: "openticketscategory",
            description:
                "Select the Category in which Open Tickets will be Created.",
            required: true,
            type: TYPES.CHANNEL,
            channelTypes: ["GUILD_CATEGORY"],
        },
        // {
        //     name: "closedticketscategory",
        //     description:
        //         "Select the Category in which Closed Tickets will be Kept!.",
        //     required: true,
        //     type: TYPES.CHANNEL,
        //     channelTypes: ["GUILD_CATEGORY"],
        // },
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
            name: "description",
            description: "Provide the Description of Ticket Panel",
            required: true,
            type: TYPES.STRING,
        },
        {
            name: "firstbutton",
            description:
                "Give Your First Button (Success Style) | name and an emoji by adding a comma | SYNTAX: NAME,EMOJI",
            required: true,
            type: TYPES.STRING,
        },
        {
            name: "secondbutton",
            description:
                "Give Your Second Button (Primary Style) | name and an emoji by adding a comma | SYNTAX: NAME,EMOJI",
            required: false,
            type: TYPES.STRING,
        },
        {
            name: "thirdbutton",
            description:
                "Give Your Third Button (Secondary Style)| name and an emoji by adding a comma | SYNTAX: NAME,EMOJI",
            required: false,
            type: TYPES.STRING,
        },
    ],

    callback: async ({ interaction }) => {
        const { guild, options } = interaction;

        if (!guild) {
            return {
                custom: true,
                embeds: [
                    new MessageEmbed()
                        .setDescription(
                            "<:Fail:935098896919707700> Please use this command within a server."
                        )
                        .setColor("RED"),
                ],
                ephemeral: true,
            };
        }

        try {
            const Channel = options.getChannel("channel");
            const Transcript = options.getChannel("transcript");
            const OpenTicketsCategory = options.getChannel(
                "openticketscategory"
            );
            // const ClosedTicketsCategory = options.getChannel(
            //     "closedticketscategory"
            // );
            const SupportRole = options.getRole("supportrole");
            const EveryoneRole = options.getRole("everyonerole");

            const DescriptionMsg = options.getString("description");

            const rawButton1 = options.getString("firstbutton");
            const rawButton2 = options.getString("secondbutton");
            const rawButton3 = options.getString("thirdbutton");

            if (!rawButton1) {
                return {
                    custom: true,
                    embeds: [
                        new MessageEmbed()

                            .setDescription(
                                "<:Fail:935098896919707700> Please Provide Name and Id for Atleast Button 1"
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
                // !ClosedTicketsCategory ||
                !SupportRole ||
                !EveryoneRole ||
                !DescriptionMsg
            ) {
                return {
                    custom: true,
                    embeds: [
                        new MessageEmbed()

                            .setDescription(
                                "<:Fail:935098896919707700> Please provide all the required fields."
                            )
                            .setColor("RED"),
                    ],
                    ephemeral: true,
                };
            }

            const Button1 = rawButton1.split(",");
            let Button2 = ["none"];
            if (rawButton2 !== null) {
                Button2 = rawButton2.split(",");
            }
            let Button3 = ["none"];
            if (rawButton3) {
                Button3 = rawButton3.split(",");
            }

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
                    Description: DescriptionMsg,
                    Buttons: [Button1[0], Button2[0], Button3[0]],
                },
                {
                    new: true,
                    upsert: true,
                }
            );

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

            const Embed = new MessageEmbed()
                .setTitle(`${guild.name} Tickets Panel`)
                .setDescription(DescriptionMsg.toString())
                .setColor("#0099ff");

            let icon = guild.iconURL()?.toString();
            if (icon) Embed.setThumbnail(icon);

            if (Channel.type === "GUILD_TEXT") {
                Channel.send({ embeds: [Embed], components: [Buttons] });
            }

            return {
                custom: true,
                embeds: [
                    new MessageEmbed()
                        .setDescription(
                            "<:Success:935099107163394061> Ticket System Setup Done!!"
                        )
                        .setColor("GREEN"),
                ],
                ephmeral: false,
            };
        } catch (err) {
            console.log(err);
            return {
                custom: true,
                embeds: [
                    new MessageEmbed()
                        .setDescription(
                            `<:Fail:935098896919707700> **__AN ERROR OCCURRED__ While Setting Up Your Ticket System**
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

import { ICommand } from "wokcommands";
import DJS, {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    Client,
} from "discord.js";
import TicketConfigSchema from "../../models/ticketconfig-schema";

const TYPES = DJS.Constants.ApplicationCommandOptionTypes;

export default {
    category: "utility",
    description: "Setup Ticket System For Your Server!",

    slash: true,
    guildOnly: true,

    testOnly: true,
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
        {
            name: "closedticketscategory",
            description:
                "Select the Category in which Closed Tickets will be Kept!.",
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
            required: true,
            type: TYPES.STRING,
        },
        {
            name: "thirdbutton",
            description:
                "Give Your Third Button (Secondary Style)| name and an emoji by adding a comma | SYNTAX: NAME,EMOJI",
            required: true,
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
            const ClosedTicketsCategory = options.getChannel(
                "closedticketscategory"
            );
            const SupportRole = options.getRole("supportrole");
            const EveryoneRole = options.getRole("everyonerole");

            const DescriptionMsg = options.getString("description");

            const rawButton1 = options.getString("firstbutton");
            const rawButton2 = options.getString("secondbutton");
            const rawButton3 = options.getString("thirdbutton");

            if (!rawButton1 || !rawButton2 || !rawButton3) {
                return {
                    custom: true,
                    embeds: [
                        new MessageEmbed()

                            .setDescription(
                                "<:Fail:935098896919707700> Please provide all the buttons!"
                            )
                            .setColor("RED"),
                    ],
                    ephemeral: true,
                };
            }
            const Button1 = rawButton1.split(",");
            const Button2 = rawButton2.split(",");
            const Button3 = rawButton3.split(",");

            if (
                !Channel ||
                !Transcript ||
                !OpenTicketsCategory ||
                !ClosedTicketsCategory ||
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

            await TicketConfigSchema.findOneAndUpdate(
                { GuildID: guild.id },
                {
                    ChannelID: Channel.id,
                    TranscriptID: Transcript.id,
                    OpenCategoryID: OpenTicketsCategory.id,
                    CloseCategoryID: ClosedTicketsCategory.id,
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
                    .setCustomId(Button1[0])
                    .setLabel(Button1[0])
                    .setStyle("SUCCESS")
                    .setEmoji(Button1[1]),
                new MessageButton()
                    .setCustomId(Button2[0])
                    .setLabel(Button2[0])
                    .setStyle("PRIMARY")
                    .setEmoji(Button2[1]),
                new MessageButton()
                    .setCustomId(Button3[0])
                    .setLabel(Button3[0])
                    .setStyle("PRIMARY")
                    .setEmoji(Button3[1])
            );

            const Embed = new MessageEmbed()
                .setAuthor({
                    name: guild.name + " | Ticketing System",
                })
                .setDescription(DescriptionMsg)
                .setColor("BLURPLE");

            if (Channel.type === "GUILD_TEXT") {
                Channel.send({ embeds: [Embed], components: [Buttons] });
            }

            return {
                custom: true,
                embeds: [
                    new MessageEmbed().setDescription(
                        "<:Success:935099107163394061> Ticket System Setup Done!!"
                    ),
                ],
                ephmeral: false,
            };
        } catch (err) {
            // console.log(err);
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

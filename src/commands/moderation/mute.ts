import DJS, { Guild, MessageEmbed, User } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: "moderation",
    description: "Mute Someone For Indefinitely",

    slash: "both",

    requireRoles: true,
    guildOnly: true,

    minArgs: 2,
    expectedArgs: "<user> <reason>",
    expectedArgsTypes: ["USER", "STRING"],

    options: [
        {
            name: "user",
            description: "Target User",
            required: true,
            type: DJS.Constants.ApplicationCommandOptionTypes.USER,
        },
        {
            name: "reason",
            description: "The reason for the mute",
            required: false,
            type: DJS.Constants.ApplicationCommandOptionTypes.STRING,
        },
    ],

    callback: async ({
        args,
        member: staff,
        guild,
        client,
        message,
        interaction,
    }) => {
        if (!guild) {
            return {
                custom: true,
                embeds: [
                    new MessageEmbed()
                        .setDescription(
                            "<:Fail:935098896919707700> Command Can Only Be Used In A Server"
                        )
                        .setColor("RED"),
                ],
                ephemeral: true,
            };
        }

        let userId = args.shift()!;
        const reason = args.join(" ");
        let user: User | undefined;

        if (message) {
            user = message.mentions.users?.first();
        } else {
            user = interaction.options.getUser("user") as User;
        }

        if (!user) {
            userId = userId.replace(/[<@!>]/g, ``);
            user = await client.users.fetch(userId);

            if (!user) {
                return {
                    custom: true,
                    embeds: [
                        new MessageEmbed()
                            .setDescription(
                                `"<:Fail:935098896919707700> Could not find a user with id \`${userId}\``
                            )
                            .setColor("RED"),
                    ],
                    ephemeral: true,
                };
            }
        }

        userId = user.id;
        const target = await guild.members.fetch(userId);

        if (!target) {
            return {
                custom: true,
                embeds: [
                    new MessageEmbed()
                        .setDescription(
                            "<:Fail:935098896919707700> Please Mention the User to Mute!"
                        )
                        .setColor("RED"),
                ],
                ephemeral: true,
            };
        }

        if (target.id === staff.id) {
            return {
                custom: true,
                embeds: [
                    new MessageEmbed()
                        .setDescription(
                            "<:Fail:935098896919707700> Cannot Mute Yourself **DUMB!!!**"
                        )
                        .setColor("RED"),
                ],
                ephemeral: true,
            };
        }

        if (reason.length > 400) {
            return {
                custom: true,
                embeds: [
                    new MessageEmbed()
                        .setDescription(
                            "<:Fail:935098896919707700> Maximum Only 400 Characters are allowed!"
                        )
                        .setColor("RED"),
                ],
                ephemeral: true,
            };
        }

        try {
            if (target) {
                const muteRole = await guild.roles.cache.find(
                    (role) => role.name === "Muted"
                );
                if (!muteRole) {
                    return {
                        custom: true,
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    "<:Fail:935098896919707700> Cannot Find 'Muted' Role."
                                )
                                .setColor("RED"),
                        ],
                        ephemeral: true,
                    };
                }

                target.roles.add(muteRole, reason);
            }
        } catch (error) {
            return {
                custom: true,
                embeds: [
                    new MessageEmbed()
                        .setDescription(
                            "<:Fail:935098896919707700> Cannot Mute that User!! \n" +
                                "```" +
                                error +
                                "```"
                        )
                        .setColor("RED"),
                ],
                ephemeral: true,
            };
        }

        return {
            custom: true,
            embeds: [
                new MessageEmbed()
                    .setDescription(
                        `<:Success:935099107163394061> <@${target.id}> was **Muted** Indefinitely | \`${target.id}\``
                    )
                    .setColor("GREEN"),
            ],
            ephemeral: false,
        };
    },
} as ICommand;

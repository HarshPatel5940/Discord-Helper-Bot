import DJS, { Guild, MessageEmbed, User } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: "moderation",
    description: "Kick a user from the server.",

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
            return "This command can only be used in a server.";
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
                return `Could not find a user with id ${userId}`;
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
                            "<:Fail:929607022675120239> Please Mention the User to Unmute!"
                        )
                        .setColor("RED"),
                ],
                ephemeral: true,
            };
        }

        if (target.id === message.author.id) {
            return {
                custom: true,
                embeds: [
                    new MessageEmbed()
                        .setDescription(
                            "<:Fail:929607022675120239> Cannot Unmute Yourself **DUMB!!!**"
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
                            "<:Fail:929607022675120239> Maximum Only 400 Characters are allowed!"
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
                                    "<:Fail:929607022675120239> Cannot Find 'Muted' Role."
                                )
                                .setColor("RED"),
                        ],
                        ephemeral: true,
                    };
                }

                target.roles.remove(muteRole, reason);
            }
        } catch (ignored) {
            return {
                custom: true,
                embeds: [
                    new MessageEmbed()
                        .setDescription(
                            "<:Fail:929607022675120239> Cannot Unmute that User!!"
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
                        `<:Success:929606936977084427> <@${user.id}> has been Unmuted! | \`${user.id}\``
                    )
                    .setColor("GREEN"),
            ],
            ephemeral: false,
        };
    },
} as ICommand;

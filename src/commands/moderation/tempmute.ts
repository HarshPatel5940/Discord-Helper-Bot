import { MessageEmbed, User } from "discord.js";
import DJS from "discord.js";
import { ICommand } from "wokcommands";
import PunishmentSchema from "../../models/Punishment-schema";

export default {
    category: "moderation",
    description: "mute a user from the server for a specific time.",

    // permissions: ["MANAGE_ROLES"],
    requireRoles: true,

    minArgs: 3,
    expectedArgs: "<user> <duration> <reason>",
    expectedArgsTypes: ["USER", "STRING", "STRING"],

    slash: "both",
    guildOnly: true,

    options: [
        {
            name: "user",
            description: "Target User",
            required: true,
            type: DJS.Constants.ApplicationCommandOptionTypes.USER,
        },
        {
            name: "duration",
            description: "The duration of the mute",
            required: true,
            type: DJS.Constants.ApplicationCommandOptionTypes.STRING,
        },
        {
            name: "reason",
            description: "The reason for the mute",
            required: true,
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
        const duration = args.shift()!;
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
                                `<:Fail:935098896919707700> Couldn't find user with id ${userId}`
                            )
                            .setColor("RED"),
                    ],
                    ephemeral: true,
                };
            }
        }

        if (user.id === staff.id) {
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

        userId = user.id;

        let time;
        let type;

        try {
            const split = duration.match(/\d+|\D+/g);
            time = parseInt(split![0]);
            type = split![1].toLowerCase();
        } catch (e) {
            return {
                custom: true,
                embeds: [
                    new MessageEmbed()
                        .setDescription(
                            `<:Fail:935098896919707700> Invalid Time Format`
                        )
                        .setColor("RED"),
                ],
                ephemeral: true,
            };
        }

        if (type === "h") {
            time *= 60;
        } else if (type === "d") {
            time *= 60 * 24;
        } else if (type !== "m") {
            return {
                custom: true,
                embeds: [
                    new MessageEmbed()
                        .setDescription(
                            'Please Use "m" "h" or "d" for minutes, hours and days respectively'
                        )
                        .setColor("RED"),
                ],
                ephemeral: true,
            };
        }

        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + time);

        const result = await PunishmentSchema.findOne({
            userId,
            type: "mute",
        });

        if (result) {
            return {
                custom: true,
                embeds: [
                    new MessageEmbed()
                        .setDescription(
                            `<:Fail:935098896919707700> User is already muted \`${user.id}\``
                        )
                        .setColor("RED"),
                ],
                ephemeral: true,
            };
        }

        try {
            const member = await guild.members.fetch(userId);
            if (member) {
                const muteRole = await guild.roles.cache.find(
                    (role) => role.name === "Muted"
                );
                if (!muteRole) {
                    return 'Could not find a **"Muted"** role';
                }

                member.roles.add(muteRole, reason);

                await new PunishmentSchema({
                    userId,
                    guildId: guild.id,
                    staffId: staff.id,
                    reason,
                    expires,
                    type: "mute",
                }).save();
            }
        } catch (ignored) {
            return {
                custom: true,
                embeds: [
                    new MessageEmbed()
                        .setDescription(
                            `<:Fail:935098896919707700> Couldn't mute user with id ${user.id}`
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
                        `<:Success:935099107163394061> <@${userId}> has been Muted for ${time}m! \`${user.id}\``
                    )
                    .setColor("GREEN"),
            ],
            ephemeral: false,
        };
    },
} as ICommand;

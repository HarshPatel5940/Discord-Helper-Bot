import { MessageEmbed, User } from "discord.js";
import { ICommand } from "wokcommands";
import PunishmentSchema from "../../models/Punishment-schema";

export default {
    category: "moderation",
    description: "Bans a user from the server for a specific time.",

    // permissions: ["MANAGE_ROLES"],
    requireRoles: true,

    minArgs: 3,
    expectedArgs: "<user> <duration> <reason>",
    expectedArgsTypes: ["USER", "STRING", "STRING"],

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
                                `<:Fail:935098896919707700> Could Not Find a user with the ID of \`${userId}\``
                            )
                            .setColor("RED"),
                    ],
                    ephemeral: true,
                };
            }
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
                            "<:Fail:935098896919707700> Invalid Time Format"
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
            type: "ban",
        });

        if (result) {
            return {
                custom: true,
                embeds: [
                    new MessageEmbed()
                        .setDescription(
                            `<:Fail:935098896919707700> <@${userId}> is already banned! \`${user.id}\``
                        )
                        .setColor("RED"),
                ],
                ephemeral: true,
            };
        }

        try {
            await guild.members.ban(userId, { reason });
            await new PunishmentSchema({
                userId,
                guildId: guild.id,
                staffId: staff.id,
                reason,
                expires,
                type: "ban",
            }).save();
        } catch (ignored) {
            return {
                custom: true,
                embeds: [
                    new MessageEmbed()
                        .setDescription(
                            "<:Fail:935098896919707700> Could Not Ban User"
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
                        `<:Success:929607022675099648> <@${userId}> has been banned for ${time} | | \`${user.id}\`!`
                    )
                    .setColor("RED"),
            ],
            ephemeral: true,
        };
    },
} as ICommand;

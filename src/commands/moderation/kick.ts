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
                        .setDescription("❌ Please Mention the User to Kick!")
                        .setColor("RED"),
                ],
                ephemeral: true,
            };
        }
        if (!target.kickable) {
            return {
                custom: true,
                embeds: [
                    new MessageEmbed()
                        .setDescription("❌ Cannot Kick this User!")
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
                        .setDescription("❌ Cannot Kick Yourself **DUMB!!!**")
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
                            "❌ Maximum Only 400 Characters are allowed!"
                        )
                        .setColor("RED"),
                ],
                ephemeral: true,
            };
        }

        try {
            const guild = message.guild as Guild;
            guild.members.kick(target, reason);
        } catch (ignored) {
            return {
                custom: true,
                embeds: [
                    new MessageEmbed()
                        .setDescription("❌ Cannot Kick that User!!!**")
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
                        `✅ <@${target.id}> was **Kicked** | \`${target.id}\``
                    )
                    .setColor("GREEN"),
            ],
            ephemeral: false,
        };
    },
} as ICommand;

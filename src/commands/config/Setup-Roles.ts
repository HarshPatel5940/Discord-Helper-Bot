import DJS, { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";

const TYPES = DJS.Constants.ApplicationCommandOptionTypes;

export default {
    name: "setup-roles",
    description: "Scans The Server and Suggests you for changes!!",
    aliases: ["fixroles", "fix-roles"],

    category: "config",
    permissions: ["ADMINISTRATOR"],

    slash: true,
    guildOnly: true,
    testOnly: true,

    globalCooldown: "1m",

    expectedArgs: "<main-role>",
    expectedArgsTypes: ["ROLE"],

    options: [
        {
            name: "main-role",
            description: "pls provide the main role of the server",
            type: TYPES.ROLE,
            required: true,
        },
    ],

    init: async () => {
        console.log(`starting setup roles cmd`);
    },

    callback: async ({ interaction }) => {
        let ROLES_MAIN = interaction.options.getRole("main-role")!.id;

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`🔃 Fetching Roles & Initializing`)
                    .setDescription(
                        `
Note: Main Role is the role everyone must have to view the server channels.
> Main Role: <@&${ROLES_MAIN}>

This Command Will remove all the "Dangerous" perms from the roles & also remove unwanted extra permissions...
`
                    )
                    .setColor("#00ffea"),
            ],
            ephemeral: false,
        });

        if (!interaction.guild) return "Was Not Able to fetch server";

        const SERVER_ROLES = await interaction.guild.roles.fetch();

        await new Promise((f) => setTimeout(f, 1000 * 3));

        interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`Editing Role Perms...`)
                    .setDescription(
                        `
**Roles Fetched Successfully**

__**NOTE:**__ Roles Below the Bot Role Can Only be edited, so drag the bot role above other roles so it can manage them!!
                    `
                    )
                    .setColor("#00ffea"),
            ],
        });

        let count: number = 0;

        SERVER_ROLES.forEach((role) => {
            if (role.editable) {
                role.setPermissions(
                    role.permissions.remove([
                        "ADMINISTRATOR",
                        "MANAGE_CHANNELS",
                        "MANAGE_ROLES",
                        "MANAGE_GUILD",
                        "MANAGE_WEBHOOKS",

                        "MENTION_EVERYONE",
                        "MANAGE_NICKNAMES",

                        "KICK_MEMBERS",
                        "BAN_MEMBERS",

                        "VIEW_CHANNEL",
                        "SEND_MESSAGES",
                        "SEND_MESSAGES_IN_THREADS",
                    ])
                );
                count += 1;
            }
        });

        const mainR = await interaction.guild.roles.fetch(ROLES_MAIN);
        if (!mainR) return "something went wrong!!";
        mainR.setPermissions(
            mainR.permissions
                .add([
                    "VIEW_CHANNEL",
                    "SEND_MESSAGES",
                    "SEND_MESSAGES_IN_THREADS",
                ])
                .remove([
                    "ADMINISTRATOR",
                    "MANAGE_CHANNELS",
                    "MANAGE_ROLES",
                    "MANAGE_GUILD",
                    "MANAGE_WEBHOOKS",

                    "MENTION_EVERYONE",
                    "MANAGE_NICKNAMES",

                    "KICK_MEMBERS",
                    "BAN_MEMBERS",
                ])
        );

        const row1 = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("main-role-humans")
                .setLabel("Give Main Role To Server Members")
                .setStyle("SUCCESS")
        );

        interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`Roles Setup Completed`)
                    .setDescription(
                        `
${count} Roles have been edited!!

Reminders:
> Make sure all the members in the server have the main role...
> Make Sure Channels have been setup properly... so they can comply with lockdown
                    `
                    )
                    .setColor("#00ffea"),
            ],
            components: [row1],
        });
    },
} as ICommand;

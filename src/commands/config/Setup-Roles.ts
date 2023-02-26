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

import DJS, {
    Client,
    MessageActionRow,
    MessageButton,
    EmbedBuilder,
} from "discord.js";
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

    cooldown: "30s",

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

    init: (client: Client) => {
        console.log("setup roles cmd loaded...");
        client.on("interactionCreate", async (interaction) => {
            if (!interaction.isButton()) return;

            const { customId } = interaction;

            if (
                !customId.startsWith("Give-Members-MainRole") ||
                !interaction.guild
            ) {
                return;
            }

            const id1 = customId.slice(customId.length - 18);

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            "\n⌛ Fetching Members & Adding Role To Members"
                        )
                        .setColor("#00ffea"),
                ],
            });

            const role1 = await interaction.guild.roles.fetch(id1);
            if (!role1) {
                await interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription("⛔ Can't Fetch Members")
                            .setColor("RED"),
                    ],
                });
                return;
            }
            let counter: number = 0;
            let members = await interaction.guild.members.fetch();

            members.forEach(async (member) => {
                if (member.user.bot) return;
                if (member.roles.cache.has(id1)) return;
                counter += 1;

                await member.roles.add(
                    role1,
                    `Adding Role after Setup: initiated by ${interaction.user.username}`
                );
            });

            setTimeout(async () => {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `✅ Adding <@&${id1}> to **${counter} Members**`
                            )
                            .setColor("#00ffea"),
                    ],
                    components: [],
                });
            }, 1000 * 5);
        });
    },

    callback: async ({ interaction }) => {
        let DESC: string = `⌛ Fetching Roles`;
        let EMBED = new EmbedBuilder()
            .setTitle(`Roles Setup Panel`)
            .setDescription(DESC)
            .setColor("#00ffea");

        await interaction.reply({
            embeds: [EMBED],
            ephemeral: false,
        });

        let ROLES_MAIN = interaction.options.getRole("main-role")!.id;
        if (!interaction.channel || !interaction.guild)
            return "Fetching Unsuccessfull";

        const SERVER_ROLES = await interaction.guild.roles.fetch();

        DESC += "\n✅ Roles Fetched Successfully\n\n⌛ Editing Roles";

        await interaction.editReply({
            embeds: [EMBED.setDescription(DESC)],
        });

        let count: number = 0;

        SERVER_ROLES.forEach(async (role) => {
            try {
                await role.setPermissions(
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
                    ]),
                    `Role Setup Initiated by ${interaction.user.username}`
                );
                count += 1;

                if (role.tags?.botId) {
                    await role.setPermissions(
                        role.permissions.add([
                            "VIEW_CHANNEL",
                            "SEND_MESSAGES",
                            "SEND_MESSAGES_IN_THREADS",
                            "EMBED_LINKS",
                        ]),
                        `Role Setup Initiated by ${interaction.user.username}`
                    );
                }
            } catch {}
        });

        const mainR = await interaction.guild.roles.fetch(ROLES_MAIN);
        if (!mainR) return "MAIN ROLE refetch went wrong!!";
        mainR.setPermissions(
            mainR.permissions
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
                .add([
                    "VIEW_CHANNEL",
                    "SEND_MESSAGES",
                    "SEND_MESSAGES_IN_THREADS",
                ]),
            `Role Setup Initiated by ${interaction.user.username}`
        );

        const row1 = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`Give-Members-MainRole-${ROLES_MAIN}`)
                .setLabel("Give Main Role To Server Members")
                .setStyle("SUCCESS")
        );

        DESC += `\n✅ Changed ${count} Roles\n\n`;
        await interaction.editReply({
            embeds: [
                EMBED.setDescription(DESC).addField(
                    "POINTS TO NOTE!!",
                    `
1) "**Give Back Permissions To Server Mods, Admins & Bots** cause this command has removed all dangerous permissions from the roles!!"

2) Make sure all the members in the server have the main role.
            `
                ),
            ],
            components: [row1],
        });

        setTimeout(() => {
            interaction.editReply({
                components: [],
            });
        }, 1000 * 30);
    },
} as ICommand;

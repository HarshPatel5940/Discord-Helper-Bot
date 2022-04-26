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
import DJS, { MessageEmbed, User } from "discord.js";
import AFK_schema from "../../models/afksystem-schema";

export default {
    description: "Set Your AFK In All Guilds",
    category: "utility",

    slash: "both",
    guildOnly: true,
    testOnly: true,

    cooldown: "2m",

    minArgs: 1,
    expectedArgs: "<text>",
    expectedArgsTypes: ["STRING"],

    options: [
        {
            name: "text",
            description: "Set Your AFK Message",
            required: true,
            type: DJS.Constants.ApplicationCommandOptionTypes.STRING,
        },
    ],

    callback: async ({ message, interaction, guild, user, text }) => {
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
        let Timestamp = null;

        if (message) {
            Timestamp = message.createdTimestamp;
        } else if (interaction) {
            Timestamp = interaction.createdTimestamp;
        }

        if (!Timestamp)
            return `<:Fail:935098896919707700> Not Able to Find Timestamp `;
        // <t:${parseInt(timestamp1.toString())}:R>

        await AFK_schema.findOneAndUpdate(
            { GuildID: guild.id, UserID: user.id },
            { afkMessage: text, Time: parseInt((Timestamp / 1000).toString()) },
            { new: true, upsert: true }
        );

        return {
            custom: true,
            embeds: [
                new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(
                        `<:Success:935099107163394061> Your Afk Has Been Set Successfully! \n message: ${text}`
                    ),
            ],
            ephemeral: true,
        };
    },
} as ICommand;

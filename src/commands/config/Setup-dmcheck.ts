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

import DJS, { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";
import mainRoleSchema from "../../models/main-role-schema";

const TYPES = DJS.Constants.ApplicationCommandOptionTypes;
export default {
    category: "config",
    description: "Force Dm closing verification For Your Server!",

    slash: true,
    guildOnly: true,

    cooldown: "10s",
    permissions: ["ADMINISTRATOR"],

    options: [
        {
            name: "channel",
            description: "The Channel You Want the DM'check embed",
            required: true,
            type: TYPES.CHANNEL,
            channelTypes: ["GUILD_TEXT"],
        },
        {
            name: "role",
            description: "The Role You want to give after Dm's Checking",
            required: true,
            type: TYPES.ROLE,
        },
    ],

    callback: async ({ interaction }) => {
        await interaction.reply({
            content: "setting up DM checking",
            ephemeral: true,
        });

        if (!interaction.guild) return "cannot fetch guild";

        const CChannel = interaction.options.getChannel("channel");
        const Crole = interaction.options.getRole("role");

        if (!CChannel || !Crole) return "Role/Channel Fetching problems";
        if (CChannel.type !== "GUILD_TEXT")
            return "Cannot fetch a proper text channel";

        const Buttons = new MessageActionRow();
        Buttons.addComponents(
            new MessageButton()
                .setCustomId("DM-Close-Check")
                .setLabel("Close Your Dm's to verify further")
                .setStyle("PRIMARY")
        );

        await CChannel.send({
            embeds: [
                new MessageEmbed()
                    .setTitle("Turn off your DMs to access the server")
                    .setDescription(
                        `
For your safety we just allow users whose DMs are turned off. To get access to the server you need to turn off your DMs for your own security.

❓ How to Turn off your Direct Messages (DMs)
\`\`\`💻 On PC\`\`\`
:one: Right-click on the server icon
:two: Navigate to “Privacy Settings”
:three: Turn off “Allow direct messages from server members”

\`\`\`📱 On Mobile\`\`\`
:one: Tap and hold the server icon
:two: Navigate to more options and scroll down
:three: Turn off “Direct Messages”
`
                    )
                    .setThumbnail(
                        "https://images-ext-2.discordapp.net/external/WMCux1XvdlLmurrOZK3F0IBRQj1DM-9eTSowDBD1f-s/%3Fsize%3D128/https/cdn.discordapp.com/avatars/935082756642308096/f6c782bf3cdc21b10a57ad4f6a67c87e.webp?width=115&height=115"
                    ),
            ],
            components: [Buttons],
        });

        await mainRoleSchema.findOneAndUpdate(
            { _id: interaction.guild.id },
            {
                _id: interaction.guild.id,
                channelID: CChannel.id,
                roleID: Crole.id,
            },
            {
                new: true,
                upsert: true,
            }
        );

        await interaction.editReply("Setup Done ✅");
    },
} as ICommand;

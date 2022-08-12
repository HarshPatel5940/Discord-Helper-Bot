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

import { Client, MessageEmbed } from "discord.js";
import mainRoleSchema from "../models/main-role-schema";

export default (client: Client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction) return;
        if (!interaction.isButton()) return;
        if (interaction.customId !== "DM-Close-Check") return;
        if (!interaction.member || !interaction.guild) return;

        const member = interaction.member;

        const user1 = await client.users.fetch(member.user.id);
        try {
            interaction.reply({ content: "verifying...", ephemeral: true });
            await user1.send({
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
                    new MessageEmbed()
                        .setTitle("Why Getting this msg?")
                        .setDescription(
                            "Follow the above steps to turn off dms and get access to the server"
                        ),
                ],
            });
        } catch (error) {
            const DATA = await mainRoleSchema.findById({
                _id: interaction.guild.id,
            });

            if (!DATA) return;
            let { roleID } = DATA;

            let member1 = await interaction.guild.members.fetch(
                interaction.member.user.id
            );
            try {
                await member1.roles.add(roleID);
            } catch (error) {}
            await interaction.followUp({
                content: "you have been verified ✅",
                ephemeral: true,
            });
        }
    });
};

export const config = {
    displayName: "Close Your DM's",
    dbName: "DM_CHECK",
};

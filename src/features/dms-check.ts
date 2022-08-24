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
        interaction.reply({ content: "verifying...", ephemeral: true });
        try {
            await user1.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Why Getting this msg?")
                        .setDescription(
                            `Please Turn Of Your Dm's in __**${interaction.guild.name}**__ to proceed further verification`
                        )
                        .setFooter({
                            text: `Guild ID: ${interaction.guild.id}`,
                        })
                        .setColor("RED"),
                ],
            });
            await interaction.editReply(
                "❌ You Have Not Been Verified. \n> please close your dms in this server"
            );
        } catch (error) {
            const DATA = await mainRoleSchema.findById({
                _id: interaction.guild.id,
            });

            if (!DATA) return;
            let { roleID } = DATA;

            let member1 = await interaction.guild.members.fetch(
                interaction.member.user.id
            );

            await interaction.editReply("✅ You Have Been Verified!!");
            try {
                await member1.roles.add(roleID);
            } catch (error) {
                await interaction.editReply(
                    "✅ You Have Been Verified!!\n\n> Bot was not able to give role to the user, please say the administrator to check the permissions"
                );
            }
        }
    });
};

export const config = {
    displayName: "Close Your DM's",
    dbName: "DM_CHECK",
};

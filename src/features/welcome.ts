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

import { Client, TextChannel, MessageEmbed } from "discord.js";
import welcomeSchema from "../models/welcome-schema";

const welcomeData = {} as {
    // GuildID     Channel    Text
    [key: string]: [TextChannel, string];
};

export default (client: Client) => {
    client.on("guildMemberAdd", async (member) => {
        const { guild, id } = member;

        let data = welcomeData[guild.id];
        let timestamp1 = member.user.createdTimestamp / 1000;

        if (!member.joinedTimestamp) return;
        let timestamp2 = member.joinedTimestamp / 1000;

        if (!data) {
            const results = await welcomeSchema.findById(guild.id);
            if (!results) {
                return;
            }

            const { channelId, text } = results;
            const channel = guild.channels.cache.get(channelId) as TextChannel;
            data = welcomeData[guild.id] = [channel, text];
        }

        data[0].send({
            content: data[1].replace(/@/g, `<@${id}>`),
            embeds: [
                new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle(`Member Info`)
                    .setDescription(
                        `
Member: <@${id}> | \`${id}\`
Created: <t:${parseInt(timestamp1.toString())}:R> | Joined: <t:${parseInt(
                            timestamp2.toString()
                        )}:R>
Total Server Members: ${guild.memberCount}
`
                    ),
            ],
        });
    });
};

export const config = {
    displayName: "Welcome Channel",
    dbName: "WELCOME_CHANNEL",
};

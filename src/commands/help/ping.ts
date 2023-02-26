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

import { EmbedBuilder } from "discord.js";
import { ICommand } from "wokcommands";
import { connection } from "mongoose";
import { timestamp1 } from "../../index";

export default {
    name: "ping",
    aliases: ["pong"],
    category: "help",
    description: "Check the latency of the bot",

    slash: "both",
    cooldown: "5s",

    callback: async ({ message, interaction, client }) => {
        if (!client.user) return "I am not ready yet!";
        let createdTimestamp: string | number;

        if (message) {
            createdTimestamp = message.createdTimestamp;
        } else if (interaction) {
            createdTimestamp = interaction.createdTimestamp;
        } else return "Cannot Fetch Created timestamp";

        const Response = new EmbedBuilder()
            .setColor("GREEN")
            .setTitle(`${client.user?.username} Status`)
            .setDescription(
                `
**Client Status**: \`🟢 Online!\`
**Database Status**: \`${switchTo(connection.readyState)}\`
**Websocket Ping**: \`${client.ws.ping}ms\`
**Client Ping**: \` ${Math.abs(createdTimestamp - Date.now())}ms \`
**Uptime**: <t:${parseInt(timestamp1.toString())}:F> | <t:${parseInt(
                    timestamp1.toString()
                )}:R>
`
            );

        const url = client.user.avatarURL();
        if (url) {
            Response.setThumbnail(url);
        }

        return {
            custom: true,
            embeds: [Response],
            ephemeral: false,
        };
    },
} as ICommand;

function switchTo(val: number) {
    var status = " ";
    switch (val) {
        case 0:
            status = `🔴 Disconnected!`;
            break;
        case 1:
            status = `🟢 Connected!`;
            break;
        case 2:
            status = `🟠 Connecting!`;
            break;
        case 3:
            status = `🟠 Disconnecting!`;
            break;
    }
    return status;
}

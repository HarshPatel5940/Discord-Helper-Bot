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

import { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";
import { connection } from "mongoose";

export default {
    name: "ping",
    aliases: ["pong"],
    category: "help",
    description: "Check the latency of the bot",

    slash: "both",
    cooldown: "5s",

    callback: async ({ message, interaction, client }) => {
        let totalSeconds = 0;
        if (client.uptime) {
            totalSeconds = client.uptime / 1000;
        }
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        let createdTimestamp = 0;

        if (message) {
            createdTimestamp = message.createdTimestamp;
        } else if (interaction) {
            createdTimestamp = interaction.createdTimestamp;
        } else return "Cannot Fetch Created timestamp";

        const Response = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("BOT STATUS")
            .setDescription(
                `<:Success:935099107163394061> **Client**: \`🟢 Online!\`
        <:Success:935099107163394061> **Database**: \`${switchTo(
            connection.readyState
        )}\`
        <:Success:935099107163394061> **Client Ping**: \`${client.ws.ping}ms\`
        <:Success:935099107163394061> **Message Ping**: \` ${Math.abs(
            createdTimestamp - Date.now()
        )}ms \`
        <:Success:935099107163394061> **Uptime**: ${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds`
            );

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

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

export default {
    category: "config",
    description: "Used to Check a Welcome cmd",

    slash: "both",
    guildOnly: true,

    permissions: ["MANAGE_MESSAGES"],

    callback: ({ member, client }) => {
        client.emit("guildMemberAdd", member);
        return {
            custom: true,
            embeds: [
                new MessageEmbed()
                    .setDescription(
                        "✅ Welcome Message Sent! **Event Has Triggered!**"
                    )
                    .setColor("GREEN"),
            ],
            ephemeral: true,
        };
    },
} as ICommand;

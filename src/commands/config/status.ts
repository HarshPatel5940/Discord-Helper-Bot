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

import DJS, { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: "config",
    description: "Change the Status of the Bot to DND",

    slash: "both",
    guildOnly: true,
    testOnly: true,

    ownerOnly: true,

    minArgs: 1,
    expectedArgs: "<text>",
    expectedArgsTypes: ["STRING"],

    options: [
        {
            name: "text",
            description: "Used To Set Status",
            required: true,
            type: DJS.Constants.ApplicationCommandOptionTypes.STRING,
        },
    ],

    callback: async ({ client, text }) => {
        client.user?.setPresence({
            status: "dnd",
            activities: [
                {
                    name: text,
                },
            ],
        });

        return {
            custom: true,
            embeds: [
                new MessageEmbed()
                    .setDescription(
                        `<:Success:935099107163394061> Status Chaneged to ${text}`
                    )
                    .setColor("GREEN"),
            ],
            ephmeral: false,
        };
    },
} as ICommand;

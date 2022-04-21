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

// make a command which sends a dropdown message
import {
    Interaction,
    MessageActionRow,
    MessageSelectMenu,
    MessageEmbed,
} from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: "fun",
    description: "Check The Dropdowns in discord",

    testOnly: true,
    slash: "both",
    serverOnly: true,
    Cooldown: "10s",

    callback: async ({ interaction: Msg, channel }) => {
        const row1 = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId("dropdowns-color")
                .setPlaceholder("select any one of the below colour")
                .setMaxValues(1)
                .setMinValues(1)
                .setOptions(
                    [
                        {
                            label: "RED",
                            value: "red",
                            description: "red colour will be selected",
                            emoji: "🔴",
                        },
                    ],
                    [
                        {
                            label: "GREEN",
                            value: "green",
                            description: "green colour will be selected",
                            emoji: "🟢",
                        },
                    ],
                    [
                        {
                            label: "BLUE",
                            value: "blue",
                            description: "blue colour will be selected",
                            emoji: "🔵",
                        },
                    ]
                )
        );
        // TODO: make a callback for the dropdown
    },
} as ICommand;

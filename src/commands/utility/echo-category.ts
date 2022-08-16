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
import DJS, { MessageEmbed } from "discord.js";

const TYPES = DJS.Constants.ApplicationCommandOptionTypes;

export default {
    category: "utility",
    description: "It will repeat the message in all the channels of a category",

    slash: true,
    testOnly: true,
    guildOnly: true,

    cooldown: "5s",

    options: [
        {
            name: "category",
            description: "Category in which you want to send the message",
            required: true,
            type: TYPES.CHANNEL,
            channelTypes: ["GUILD_CATEGORY"],
        },
        {
            name: "text",
            description: "The Text you want to send to the channels",
            required: true,
            type: TYPES.STRING,
        },
    ],

    callback: async ({ interaction }) => {
        if (!interaction || !interaction.guild) return;

        const category1 = interaction.options.getChannel("category");
        const text1 = interaction.options.getString("text");

        if (!category1) return "can't fetch category";

        const Ccategory = interaction.guild.channels.cache.get(category1.id);

        if (!Ccategory || Ccategory.type !== "GUILD_CATEGORY") return;

        let childs = Ccategory.children;

        console.log(childs);
    },
} as ICommand;

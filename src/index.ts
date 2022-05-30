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

import DiscordJS from "discord.js";
import WOKCommands from "wokcommands";
import path from "path";
import dotenv from "dotenv";

const wait = require("timers/promises").setTimeout;

export var timestamp1 = Date.now() / 1000;

// dotenv.config({ path: ".env.test" });
dotenv.config();

const client = new DiscordJS.Client({
    intents: 32767,
});

client.on("ready", async () => {
    new WOKCommands(client, {
        commandDir: path.join(__dirname, "commands"),
        featureDir: path.join(__dirname, "features"),

        typeScript: true,

        testServers: ["896301214269063218"],
        botOwners: process.env.OWNER_ID,
        mongoUri: process.env.MONGO_URI,
    })
        .setDefaultPrefix(">>")
        .setDefaultLanguage("en")
        .setCategorySettings([
            {
                name: "help",
                emoji: "📃",
                description: "Help Commands",
                color: "GREEN",
                aliases: ["h", "help"],
            },
            {
                name: "moderation",
                emoji: "⚒️",
                description: "Moderation Commands",
                color: "BLURPLE",
                aliases: ["m", "mod", "moderation"],
            },
            {
                name: "fun",
                emoji: "🎉",
                description: "Fun Commands | Learn more about discord features",
            },
            {
                name: "config",
                emoji: "🔧",
                description: "Config Commands",
                color: "BLUE",
                aliases: ["c", "config"],
            },
            {
                name: "owner",
                emoji: "👑",
                description: "Owner Commands",
                color: "RED",
                aliases: ["o", "owner"],
            },
            {
                name: "utility",
                emoji: "👊",
                description: "Utility Commands",
                color: "PURPLE",
                aliases: ["u", "utility"],
            },
            {
                name: "ticket",
                emoji: "🎫",
                description: "Ticket Commands",
                color: "YELLOW",
                aliases: ["t", "ticket"],
            },
        ]);

    await wait(1000);
    if (!client.user) return;
    console.log(
        `(${client.user.id}) ${client.user.tag} is coming online | Prefix: >>\n`
    );
});

client.login(process.env.BOT_TOKEN);

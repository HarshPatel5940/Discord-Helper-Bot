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

import DiscordJS, { MessageEmbed } from "discord.js";
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
    await wait(1000);
    if (!client.user) return;
    console.log(
        `(${client.user.id}) ${client.user.tag} is online | Prefix: >>\n`
    );

    const wokclient = new WOKCommands(client, {
        commandDir: path.join(__dirname, "commands"),
        featureDir: path.join(__dirname, "features"),

        typeScript: true,

        testServers: ["896301214269063218"],
        botOwners: process.env.OWNER_ID,
        mongoUri: process.env.MONGO_URI,

        disabledDefaultCommands: ["help", "language"],
        debug: true,
    })
        .setDefaultPrefix(">>")
        .setDefaultLanguage("en");

    wokclient.on("commandException", (command: any, error: any) => {
        return {
            custom: true,
            content: `An exception occurred when using command "${command.names[0]}"! The error is:`,
            embed: [
                new MessageEmbed().setDescription(
                    `\`\`\`console\n${error}\`\`\``
                ),
            ],
        };
    });
});

client.login(process.env.BOT_TOKEN);

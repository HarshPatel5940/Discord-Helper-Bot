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

export default {
    name: "source",
    aliases: ["src", "code", "sourcecode"],
    category: "help",
    description: "Gives The Link To Bot's Github Repository",

    slash: true,
    guildOnly: true,
    cooldown: "5s",

    callback: async () => {
        return {
            custom: true,
            content:
                "[Link To Github 🔗](<https://github.com/HarshPatel5940/DiscordiansHelper>)",
        };
    },
} as ICommand;

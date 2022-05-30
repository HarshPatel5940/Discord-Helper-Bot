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
import { Client } from "discord.js";

export default (client: Client) => {
    const statusOptions = [
        "Discord.JS Bots",
        "OpenSource Community",
        "HarshPatel5940#3210",
        ">>help - /help",
        "Bot Version 1.1.3",
    ];
    let counter = 0;

    const updateStatus = () => {
        client.user?.setActivity(statusOptions[counter], { type: "WATCHING" });

        if (++counter >= statusOptions.length) {
            counter = 0;
        }

        setTimeout(updateStatus, 1000 * 60 * 2);
    };
    updateStatus();
};

export const config = {
    dbName: "STATUS_CHANGER",
    displayName: "Status Changer",
};

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

import { Client, Message, MessageEmbed, PartialMessage } from "discord.js";

export default (client: Client) => {
    client.on("messageCreate", async (message) => {
        CheckSelfBot(message);
    });

    client.on("messageUpdate", (oldMessage, newMessage) => {
        CheckSelfBot(newMessage);
    });
};

async function CheckSelfBot(targetMsg: Message | PartialMessage) {
    if (!targetMsg) return;
    if (!targetMsg.guild) return;
    if (targetMsg.author?.bot) return;
    if (!targetMsg.embeds) return;
    if (targetMsg.attachments.size !== 0) return;
    if (targetMsg.content?.length !== 0) return;

    await targetMsg.delete();
    await targetMsg.channel.send({
        embeds: [
            new MessageEmbed().setDescription(
                `
:skull: <@${targetMsg.member?.id}> is a possibly a self bot account!!

Member Name: ${targetMsg.member?.user.username}#${targetMsg.member?.user.tag}
Member ID:${targetMsg.member?.user.id}

> It is suggested to kick/Ban this account after a manual investigation.
`
            ),
        ],
    });
}

export const config = {
    displayName: "Anti Self Bot System!!",
    dbName: "ANTI_SELF_BOT",
};

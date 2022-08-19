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
import { Client, MessageEmbed } from "discord.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

export default async (client: Client) => {
    var title: string = "something went wrong";
    var desc: any = "> *unknown error messsage*";

    process.on("unhandledRejection", async (reason) => {
        title = "UNHANDLED REJECTION FOUND!!!";
        desc = reason;
        await ReportError(client, title, desc);
    });

    process.on("uncaughtExceptionMonitor", async (reason) => {
        title = "UNCAUGHT EXCEPTION FOUND!!!";
        desc = reason;
        await ReportError(client, title, desc);
    });

    process.on("multipleResolves", async (type, reason) => {
        title = "MULTIPLE RESOLVES FOUND!!!";
        desc = `${reason}\n\ntype:${type}`;
        await ReportError(client, title, desc);
    });
};

export const config = {
    dbName: "INTERACTION_HANDLING",
    displayName: "Error Handling",
};

async function ReportError(client: Client, title: string, desc: string) {
    const ErrEmbed = new MessageEmbed()
        .setTitle(title)
        .setDescription(
            `
\`\`\`
${desc}
\`\`\`
Error Reported at: <t:${parseInt((Date.now() / 1000).toString())}:F>
`
        )
        .setColor("RED")
        .setFooter({ text: "Error Handling System." })
        .setTimestamp();

    console.log(title, "\n", desc, "\n\n");

    if (!process.env.OWNER_ID) {
        return;
    }
    const c = client.users.cache.get(process.env.OWNER_ID);
    if (!c) {
        return;
    }

    c.send({ embeds: [ErrEmbed] });
}

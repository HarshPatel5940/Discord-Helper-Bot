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
import PunishmentSchema from "../models/Punishment-schema";

export default (client: Client) => {
    client.on("guildMemberAdd", async (member) => {
        const result = await PunishmentSchema.findOne({
            guildId: member.guild.id,
            userId: member.id,
            type: "mute",
        });

        if (result) {
            const muteRole = member.guild.roles.cache.find(
                (role) => role.name === "Muted"
            );
            if (muteRole) {
                member.roles.add(muteRole);
                member.send(
                    `You have been muted in ${member.guild.name}, reason: tried rejoining while under mute duration`
                );
            }
        }
    });

    const check = async () => {
        const query = {
            expires: { $lt: new Date() },
        };
        const results = await PunishmentSchema.find(query);

        for (const result of results) {
            const { guildId, userId, type } = result;

            const guild = client.guilds.cache.get(guildId);
            if (!guild) {
                console.log(`Guild ${guildId} no Longer uses this bot`);
                continue;
            }

            if (type === "ban") {
                guild.members.unban(userId, "Ban Expired (Duration done)");
            } else if (type === "mute") {
                const muteRole = guild.roles.cache.find(
                    (role) => role.name === "Muted"
                );
                if (!muteRole) {
                    continue;
                }
                const member = guild.members.cache.get(userId);
                if (!member) {
                    continue;
                }

                await member.roles.remove(
                    muteRole,
                    "Mute Expired (Duration done)"
                );
            }
        }
        await PunishmentSchema.deleteMany(query);

        setTimeout(check, 1000 * 60);
    };
    check();
};

export const config = {
    dbName: "EXPIRED_PUNISHMENTS",
    displayName: "Expired Punishments",
};

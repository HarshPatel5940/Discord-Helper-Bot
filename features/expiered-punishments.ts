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

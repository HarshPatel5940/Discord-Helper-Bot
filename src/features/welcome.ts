import { Client, TextChannel, MessageEmbed } from "discord.js";
import welcomeSchema from "../models/welcome-schema";

const welcomeData = {} as {
    // GuildID     Channel    Text
    [key: string]: [TextChannel, string];
};

export default (client: Client) => {
    client.on("guildMemberAdd", async (member) => {
        const { guild, id } = member;

        let data = welcomeData[guild.id];
        let timestamp1 = member.user.createdTimestamp / 1000;

        if (!member.joinedTimestamp) return;
        let timestamp2 = member.joinedTimestamp / 1000;

        if (!data) {
            const results = await welcomeSchema.findById(guild.id);
            if (!results) {
                return;
            }

            const { channelId, text } = results;
            const channel = guild.channels.cache.get(channelId) as TextChannel;
            data = welcomeData[guild.id] = [channel, text];
        }

        data[0].send({
            content: data[1].replace(/@/g, `<@${id}>`),
            embeds: [
                new MessageEmbed()
                    .setColor("BLURPLE")
                    .setDescription(
                        `
                    Member: <@${id}>
                    Member ID: ${id}
                    Created: <t:${parseInt(timestamp1.toString())}:R>
                    Joined: <t:${parseInt(timestamp2.toString())}:R>
                    `
                    )
                    .setThumbnail(member.displayAvatarURL())
                    .setTitle(`${member.displayName} Welcome To The Server!`)
                    .setFooter({
                        text: `${guild.name} | members: ${guild.memberCount}`,
                        iconURL: guild.iconURL()?.toString(),
                    }),
            ],
        });
    });
};

export const config = {
    displayName: "Welcome Channel",
    dbName: "WELCOME_CHANNEL",
};

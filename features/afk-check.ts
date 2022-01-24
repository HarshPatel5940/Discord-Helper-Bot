import DJS, { Client, DMChannel, MessageEmbed } from "discord.js";
import AFK_Schema from "../models/afksystem-schema";

export default (client: Client) => {
    client.on("messageCreate", async (message) => {
        if (message.author.bot) return;
        if (message.channel.type.toString() === DMChannel.toString()) return;

        const { guild } = message;
        if (!guild) return;

        if (message.mentions.members?.size) {
            const Embed = new MessageEmbed().setColor("BLURPLE");
            let found = false;
            message.mentions.members.forEach((m) => {
                AFK_Schema.findOne({GuildID: guild.id,  UserId: m.id }, async (err: any, data: { afkMessage: any; Time: any }) => {
                        if (err) throw err;
                        if (data) 
                        Embed.setDescription(`${m} went AFK <t:${data.Time}:R>\nMessage: ${data.afkMessage}`)
                        found = true;
                });
            });
            if (found) await message.reply({embeds: [Embed]});
        }
    });
};

export const config = {
    displayName: "AFK Message",
    dbName: "AFK_MESSAGE",
};

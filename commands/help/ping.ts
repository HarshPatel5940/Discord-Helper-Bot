import { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    name: "ping",
    category: "help",
    description: "Check the latency of the bot",

    slash: "both",
    cooldown: "5s",

    callback: async (message) => {
        // const msg = await message.channel.send("Pinging...");
        // const msgping = (msg.createdTimestamp - Date.now()).toString();
        // await msg.delete();

        // const ping = `Bot Latency is ${msgping}`;

        // `<:Success:929606936977084427> API Latency: ${message.client.ws.ping}ms`
        return {
            custom: true,
            embeds: [
                new MessageEmbed()
                    .setDescription(
                        `<:Success:929606936977084427> API Latency: ${message.client.ws.ping}ms |\`bot latency: coming soon\``
                    )
                    .setColor("GREEN"),
            ],
            ephemeral: false,
        };
    },
} as ICommand;

import { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: "help",
    description: "Used to Check a Welcome cmd",

    slash: "both",

    callback: ({ member, client }) => {
        client.emit("guildMemberAdd", member);
        return {
            custom: true,
            embeds: [
                new MessageEmbed()
                    .setDescription(
                        "<:Success:935099107163394061> Welcome Message Sent! **Event Has Triggered!**"
                    )
                    .setColor("GREEN"),
            ],
            ephemeral: false,
        };
    },
} as ICommand;

import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: "fun",
    description: "Check The Buttons in discord",

    slash: "both",
    Cooldown: "10s",

    callback: async ({ interaction: msgInt, channel }) => {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("Primary")
                    .setLabel("primary")
                    .setStyle("PRIMARY")
            )

            .addComponents(
                new MessageButton()
                    .setCustomId("Secondary")
                    .setLabel("Secondary")
                    .setStyle("SECONDARY")
            )

            .addComponents(
                new MessageButton()
                    .setCustomId("Sucess")
                    .setLabel("Sucess")
                    .setStyle("SUCCESS")
            )

            .addComponents(
                new MessageButton()
                    .setCustomId("Danger")
                    .setLabel("Danger")
                    .setStyle("DANGER")
            )

            .addComponents(
                new MessageButton()
                    .setURL("https://www.google.com")
                    .setLabel("google")
                    .setStyle("LINK")
            );

        await msgInt.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription("Choose one of the Buttons")
                    .setColor("BLURPLE"),
            ],
            components: [row],
            ephemeral: true,
        });

        const collector = channel.createMessageComponentCollector({
            max: 1,
        });

        collector.on("end", async (collection) => {
            if (collection.first()?.customId === "Primary") {
                await msgInt.followUp({
                    content: "You Choosed Primary Button",
                    ephemeral: true,
                });
            } else if (collection.first()?.customId === "Secondary") {
                await msgInt.followUp({
                    content: "You Choosed Secondary Button",
                    ephemeral: true,
                });
            } else if (collection.first()?.customId === "Sucess") {
                await msgInt.followUp({
                    content: "You Choosed Sucess Button",
                    ephemeral: true,
                });
            } else if (collection.first()?.customId === "Danger") {
                await msgInt.followUp({
                    content: "You Choosed Danger Button",
                    ephemeral: true,
                });
            }

            msgInt.editReply({
                components: [],
            });
        });
    },
} as ICommand;

import {
    Client,
    Modal,
    TextInputComponent,
    MessageActionRow,
    ModalActionRowComponent,
    MessageEmbed,
} from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: "fun",
    description: "Check The Modals in discord",

    testOnly: true,
    slash: "both",
    serverOnly: true,
    Cooldown: "5s",

    init: (client: Client) => {
        client.on("interactionCreate", async (interaction) => {
            if (!interaction.isModalSubmit()) return;

            const favoriteColor =
                interaction.fields.getTextInputValue("favoriteColorInput");
            const hobbies =
                interaction.fields.getTextInputValue("hobbiesInput");

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(
                            `Your favorite color is ${favoriteColor} and your hobbies are ${hobbies}`
                        ),
                ],
                ephemeral: true,
            });
        });
    },

    callback: async ({ interaction }) => {
        const modal = new Modal().setCustomId("myModal").setTitle("Testing Modals | New Discord Feature");

        const favoriteColorInput = new TextInputComponent()
            .setCustomId("favoriteColorInput")
            .setLabel("What's your favorite color?")
            .setStyle("SHORT");
        const hobbiesInput = new TextInputComponent()
            .setCustomId("hobbiesInput")
            .setLabel("What's some of your favorite hobbies?")
            .setStyle("PARAGRAPH");
        const firstActionRow =
            new MessageActionRow<ModalActionRowComponent>().addComponents(
                favoriteColorInput
            );
        const secondActionRow =
            new MessageActionRow<ModalActionRowComponent>().addComponents(
                hobbiesInput
            );
        modal.addComponents(firstActionRow, secondActionRow);
        await interaction.showModal(modal);
    },
} as ICommand;

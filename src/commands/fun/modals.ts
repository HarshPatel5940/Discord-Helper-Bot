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

import {
    Client,
    Modal,
    TextInputComponent,
    MessageActionRow,
    ModalActionRowComponent,
    EmbedBuilder,
} from "discord.js";
import { ICommand } from "wokcommands";

export default {
    name: "fun-modals",
    category: "fun",
    description: "Check The Modals in discord",

    slash: true,
    guildOnly: true,
    Cooldown: "10s",

    init: (client: Client) => {
        client.on("interactionCreate", async (interaction) => {
            if (!interaction.isModalSubmit()) return;
            if (interaction.customId !== "myModal") return;

            const favoriteColor =
                interaction.fields.getTextInputValue("favoriteColorInput");
            const hobbies =
                interaction.fields.getTextInputValue("hobbiesInput");

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
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
        const modal = new Modal()
            .setCustomId("myModal")
            .setTitle("Modals - New Discord Feature");

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

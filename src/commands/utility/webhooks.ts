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
    WebhookClient,
} from "discord.js";
import { ICommand } from "wokcommands";

export default {
    name: "webhooks-send",
    category: "utility",
    description: "Send Messages Through Webhooks",

    permissions: ["ADMINISTRATOR"],

    slash: true,
    guildOnly: true,
    Cooldown: "10s",

    init: (client: Client) => {
        client.on("interactionCreate", async (interaction) => {
            if (!interaction.isModalSubmit()) return;
            if (interaction.customId !== "webhook-modal") return;

            const WEBHOOK_URL = interaction.fields
                .getTextInputValue("WEBHOOK_URL")
                .toString();
            const WEBHOOK_DATA = interaction.fields
                .getTextInputValue("WEBHOOK_DATA")
                .toString();
            const WEBHOOK_USERNAME = interaction.fields
                .getTextInputValue("WEBHOOK_USERNAME")
                .toString();

            try {
                const wc = new WebhookClient({ url: WEBHOOK_URL });
                wc.send({
                    content: WEBHOOK_DATA,
                    username: WEBHOOK_USERNAME,
                });
            } catch (err) {
                throw err;
            }

            interaction.reply({
                content: `✅ Successfully Sent Data Thorugh Webhook`,
                ephemeral: true,
            });
        });
    },

    callback: async ({ interaction }) => {
        const modal = new Modal()
            .setCustomId("webhook-modal")
            .setTitle("Send txt Through Webhooks");

        const WEBHOOK_URL = new TextInputComponent()
            .setCustomId("WEBHOOK_URL")
            .setLabel("PASTE THE WEBHOOK URL BELOW")
            .setStyle("SHORT")
            .setMaxLength(130)
            .setMinLength(115)
            .setRequired(true);

        const WEBHOOK_DATA = new TextInputComponent()
            .setCustomId("WEBHOOK_DATA")
            .setLabel("What text you want to send?")
            .setStyle("PARAGRAPH")
            .setMaxLength(1500)
            .setRequired(true);

        const WEBHOOK_USERNAME = new TextInputComponent()
            .setCustomId("WEBHOOK_USERNAME")
            .setLabel("With What name do you want to send data?")
            .setStyle("SHORT")
            .setMaxLength(30)
            .setRequired(true);

        const firstActionRow =
            new MessageActionRow<ModalActionRowComponent>().addComponents(
                WEBHOOK_URL
            );
        const secondActionRow =
            new MessageActionRow<ModalActionRowComponent>().addComponents(
                WEBHOOK_DATA
            );
        const thirdActionRow =
            new MessageActionRow<ModalActionRowComponent>().addComponents(
                WEBHOOK_USERNAME
            );
        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);
        await interaction.showModal(modal);
    },
} as ICommand;

// webhook spam for testing automod
// URL = https://discord.com/api/webhooks/974997681900490812/Y6fewhes_WywBMjBIm0yhkOKut7q1SaNkq8tGSZ3MLExEacg4toOZrJgqoDloEO36eRw

import { WebhookClient } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    name: "spam",
    description: "test-spam",
    aliases: ["ts"],
    category: "config",

    slash: true,
    guildOnly: true,
    testOnly: true,

    calback: async () => {
        const wc = new WebhookClient({
            url: "https://discord.com/api/webhooks/974997681900490812/Y6fewhes_WywBMjBIm0yhkOKut7q1SaNkq8tGSZ3MLExEacg4toOZrJgqoDloEO36eRw",
        });

        wc.send({
            username: "Testing Spam",
            content: "@everyone HarshPatel5940 Testing for fnaki on 14 May ",
        });
        wc.send({
            username: "Testing Spam",
            content: "@everyone HarshPatel5940 Testing for fnaki on 14 May ",
        });
        wc.send({
            username: "Testing Spam",
            content: "@everyone HarshPatel5940 Testing for fnaki on 14 May ",
        });
        wc.send({
            username: "Testing Spam",
            content: "@everyone HarshPatel5940 Testing for fnaki on 14 May ",
        });
        wc.send({
            username: "Testing Spam",
            content: "@everyone HarshPatel5940 Testing for fnaki on 14 May ",
        });

        return "Done";
    },
} as ICommand;

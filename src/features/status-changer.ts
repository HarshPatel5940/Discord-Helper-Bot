import { Client } from "discord.js";

export default (client: Client) => {
    const statusOptions = [
        "HARSHPATEL5940",
        "DiscordJS Bots Growing",
        "TypeScript Community",
        ">>help - /help ",
        "Version 1.0.5",
    ];
    let counter = 0;

    const updateStatus = () => {
        client.user?.setActivity(statusOptions[counter], { type: "WATCHING" });

        if (++counter >= statusOptions.length) {
            counter = 0;
        }

        setTimeout(updateStatus, 1000 * 60 * 5);
    };
    updateStatus();
};

export const config = {
    dbName: "STATUS_CHANGER",
    displayName: "Status Changer",
};

import { Client } from "discord.js";

export default (client: Client) => {
    const statusOptions = [
        "HARSH PATEL 5940",
        "DiscordJS Bot tutorials",
        "@HarshPatel5940",
        "Harsh Patel's Server",
        "Discord Community Grow!",
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

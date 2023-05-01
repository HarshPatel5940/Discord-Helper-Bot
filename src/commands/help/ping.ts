// checking stuff
import { Command } from "../../utils/Commands";

export default new Command({
    name: "ping",
    description: "Pong!",

    callback: async ({ interaction }) => {
        // await interaction.deleteReply();
        await interaction.reply("Pong!");
    },
});

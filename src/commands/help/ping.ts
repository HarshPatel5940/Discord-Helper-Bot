// checking stuff
import { Command } from "../../structures/Commands";

export default new Command({
    name: "ping",
    description: "Pong!",

    run: async ({ interaction }) => {
        // await interaction.deleteReply();
        await interaction.reply("Pong!");
    },
});

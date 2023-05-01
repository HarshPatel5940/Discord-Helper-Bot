import { Command } from "../../utils/Commands";

export default new Command({
    name: "tping",
    description: "Pong!",
    testOnly: false,

    callback: async ({ interaction }) => {
        await interaction.reply("Pong!");
    },
});

import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });
import { Client, GatewayIntentBits, Partials } from "discord.js";

const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages],
    partials: [User, Message, GuildMember, ThreadMember],
});

// Client.events = new Collection();

client.login(process.env.BOT_TOKEN);

client.on("ready", async () => {
    console.log(`Logged in as ${client.user?.username} | ${client.user?.id}`);
    // client.user?.setActivity(`With ${client.guilds.cache.size} guilds`);
});

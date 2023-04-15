import { Event } from "../functions/Events";

export default new Event("ready", (client) => {
    console.log(`Logged in as ${client.user?.username} | ${client.user?.id}`);
});

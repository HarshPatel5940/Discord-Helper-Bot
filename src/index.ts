require("dotenv").config({ path: ".env.example" });

import { ExtendedClient } from "./functions/Client";

export const client = new ExtendedClient();

client.login(process.env.BOT_TOKEN);

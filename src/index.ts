require("dotenv").config({ path: ".env.example" });

import { ExtendedClient } from "./structures/Client";

export const client = new ExtendedClient();

client.start();

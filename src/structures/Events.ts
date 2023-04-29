import { ClientEvents } from "discord.js";
export class Event<key extends keyof ClientEvents> {
    constructor(
        public event: key,
        public run: (...args: ClientEvents[key]) => any
    ) {}
}

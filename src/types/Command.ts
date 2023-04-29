import {
    ApplicationCommandDataResolvable,
    ChatInputApplicationCommandData,
    CommandInteraction,
    CommandInteractionOptionResolver,
    GuildMember,
    Message,
    PermissionResolvable,
} from "discord.js";
import { ExtendedClient } from "../structures/Client";

export interface ExtendedInteraction extends CommandInteraction {
    member: GuildMember;
}

interface RunOptions {
    client: ExtendedClient;
    interaction: ExtendedInteraction;
    // message: Message; // ! THis is NOT NEEDED EVERYTIME
    args: CommandInteractionOptionResolver;
}

type RunFunction = (options: RunOptions) => any;

export type CommandType = {
    userPermissions?: PermissionResolvable[];
    run: RunFunction;
} & ChatInputApplicationCommandData;

export interface RegisterCommandsOptions {
    guildId?: string;
    commands: ApplicationCommandDataResolvable[];
}

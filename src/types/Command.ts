import {
    ApplicationCommandDataResolvable,
    ChatInputApplicationCommandData,
    CommandInteraction,
    CommandInteractionOptionResolver,
    PermissionResolvable,
} from "discord.js";
import { ExtendedClient } from "../functions/Client";

interface RunOptions {
    client: ExtendedClient;
    interaction: CommandInteraction;
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

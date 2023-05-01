import {
    ApplicationCommandDataResolvable,
    ChatInputApplicationCommandData,
    CommandInteraction,
    CommandInteractionOptionResolver,
    GuildMember,
    PermissionResolvable,
} from "discord.js";
import { ExtendedClient } from "./Client";

export interface ExtendedInteraction extends CommandInteraction {
    member: GuildMember;
}

interface RunOptions {
    client: ExtendedClient;
    interaction: ExtendedInteraction;
    args: CommandInteractionOptionResolver;
}

type RunFunction = (options: RunOptions) => any;

export type CommandType = {
    name: string;
    description: string;
    testOnly?: boolean;
    requiredPermissions?: PermissionResolvable[];
    userPermissions?: PermissionResolvable[];
    callback: RunFunction;
} & ChatInputApplicationCommandData;

export interface RegisterCommandsOptions {
    CmdInfo?: "global" | "test";
    commands: ApplicationCommandDataResolvable[];
}

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
    permittedGuilds?: number[] extends (infer T)[] ? T[] : number[];
    testOnly?: boolean;
    requiredPermissions?: PermissionResolvable[];
    userPermissions?: PermissionResolvable[];
    callback: RunFunction;
} & ({ testOnly: true; permittedGuilds?: never } | { testOnly?: false }) &
    ChatInputApplicationCommandData;

export interface RegisterCommandsOptions {
    CmdType?: "global" | "guild" | "test";
    commands: ApplicationCommandDataResolvable[] & CommandType[];
}

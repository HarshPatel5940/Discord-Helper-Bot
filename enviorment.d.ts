declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BOT_TOKEN: string;
            OWNER_ID: string;
            testGuild_ID: string;
            MONGO_URI: string;
            environment: "dev" | "prod";
        }
    }
}

export {};

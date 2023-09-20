import { EnvSchemaType } from "./types/envSchema";

declare global {
    namespace NodeJS {
        interface ProcessEnv extends EnvSchemaType {}
    }
}

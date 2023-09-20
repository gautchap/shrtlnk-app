import z from "zod";

const envSchema = z.object({
    MONGO_URI: z.string().trim().min(1),
    VITE_APP_DOMAIN: z.string().trim().min(1),
    VITE_API_GEO: z.string().trim().min(1),
    VITE_APP_PORT: z.number().default(5173),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const envServer = envSchema.safeParse({
    MONGO_URI: process.env.MONGO_URI,
    VITE_APP_DOMAIN: process.env.VITE_APP_DOMAIN,
    VITE_API_GEO: process.env.VITE_API_GEO,
    VITE_APP_PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
});

if (!envServer.success) {
    console.error(envServer.error.issues);
    throw new Error("There is an error with the server environment variables");
    process.exit(1);
}

export const envServerSchema = envServer.data;
export type EnvSchemaType = z.infer<typeof envSchema>;

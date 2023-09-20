import { z } from "zod";

const shortUrl = z.string().min(1).max(8);

export const ShortUrlSchemaValidator = z.object({
    shortUrl,
});

export const UrlSchemaValidator = z.object({
    longUrl: z.string().url(),
    shortUrl,
});

export type IURL = z.infer<typeof UrlSchemaValidator>;

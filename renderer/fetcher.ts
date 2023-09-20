import { HeadersInit, RequestInit } from "node-fetch";
import { z } from "zod";
import { IURL, ShortUrlSchemaValidator } from "../types/urls";

export const url = import.meta.env.PROD
    ? `https://www.${import.meta.env.VITE_APP_DOMAIN}`
    : `http://localhost:${import.meta.env.VITE_APP_PORT}`;

interface ClientConfig<T> {
    data?: unknown;
    zodSchema?: z.ZodSchema<T>;
    method?: "DELETE" | "GET" | "OPTIONS" | "PATCH" | "POST" | "PUT";
    headers?: HeadersInit;
    customConfig?: RequestInit;
    signal?: AbortSignal;
}

async function client<T>(
    url: string,
    { data, zodSchema, method, headers: customHeaders, signal, customConfig }: ClientConfig<T> = {}
): Promise<T> {
    const config: RequestInit = {
        method: method ?? (data ? "POST" : "GET"),
        body: data ? JSON.stringify(data) : null,
        headers: {
            "Content-Type": data ? "application/json" : "",
            Accept: "application/json",
            ...customHeaders,
        },
        signal,
        ...customConfig,
    };

    return window.fetch(url, config).then(async (response) => {
        if (response.status === 409) {
            throw new Error("Ce lien existe déjà !");
        }

        let result = null;
        try {
            result = response.status === 204 ? null : await response.json();
        } catch (error: unknown) {
            return Promise.reject(error);
        }
        console.log(zodSchema, result);

        if (response.ok) {
            return zodSchema && result ? zodSchema.parse(result) : result;
        } else {
            throw result;
        }
    });
}

export const createUrl = async ({ longUrl }: { longUrl: string }) =>
    client(`${url}/api/createurl`, { method: "POST", data: { longUrl }, zodSchema: ShortUrlSchemaValidator });

export const createCustomUrl = async ({ longUrl, shortUrl }: IURL) =>
    client(`${url}/api/createcustomurl`, {
        method: "POST",
        data: { longUrl, shortUrl },
        zodSchema: ShortUrlSchemaValidator,
    });

export const getUrl = async (shortUrl: string) => client(`${url}/api/shorturl?url=${shortUrl}`);

import { Router } from "express";
import { createUrl, findUrl } from "./models/url.service.js";
import { customAlphabet } from "nanoid";
import { IURL } from "../types/urls.js";
import { ParsedQs } from "qs";

export const router = Router();

router.post("/createcustomurl", async (req, res) => {
    const { longUrl, shortUrl }: IURL = req.body;

    const found = await findUrl(shortUrl);

    if (found) {
        return res.sendStatus(409);
    }

    const add = await createUrl({ longUrl, shortUrl });

    if (add) {
        return res.status(201).send({ shortUrl });
    }
});

router.post("/createurl", async (req, res) => {
    const parameters: IURL = req.body;

    async function customizeUrl(url: string) {
        const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const nanoid = customAlphabet(alphabet, 8);
        const shortUrl = nanoid();

        const foundNano = await findUrl(shortUrl);

        if (foundNano) {
            return customizeUrl(url);
        }

        const add = await createUrl({ longUrl: url, shortUrl });

        if (!add) {
            return res.sendStatus(500);
        }

        return res.status(201).send({ shortUrl });
    }

    await customizeUrl(parameters.longUrl);
});

router.get("/shorturl", async (req, res) => {
    const { url } = req.query;

    const found = await findUrl(url);

    if (found) {
        return res.status(200).send({ longUrl: found.longUrl });
    }

    return res.sendStatus(404);
});

import { IURL } from "../../types/urls.js";
import urls from "./url.model.js";

export async function createUrl(input: IURL) {
    try {
        const created = await urls.create(input);
        return created.toJSON();
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function findUrl(url: string) {
    try {
        const found = await urls.findOne({ shortUrl: url });
        return found;
    } catch (error: any) {
        throw new Error(error);
    }
}

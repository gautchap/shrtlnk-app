import { Schema, model } from "mongoose";

const UrlSchema = new Schema(
    {
        longUrl: { type: String },
        shortUrl: { type: String },
        date: { type: Date, default: Date.now },
    },
    { versionKey: false }
);

export default model("urls", UrlSchema);

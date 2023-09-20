// This file isn't processed by Vite, see https://github.com/brillout/vite-plugin-ssr/issues/562
// Consequently:
//  - When changing this file, you needed to manually restart your server for your changes to take effect.
//  - To use your environment variables defined in your .env files, you need to install dotenv, see https://vite-plugin-ssr.com/env
//  - To use your path aliases defined in your vite.config.js, you need to tell Node.js about them, see https://vite-plugin-ssr.com/path-aliases

// If you want Vite to process your server code then use one of these:
//  - vavite (https://github.com/cyco130/vavite)
//     - See vavite + vite-pugin-ssr examples at https://github.com/cyco130/vavite/tree/main/examples
//  - vite-node (https://github.com/antfu/vite-node)
//  - HatTip (https://github.com/hattipjs/hattip)
//    - You can use Bati (https://batijs.github.io/) to scaffold a vite-plugin-ssr + HatTip app. Note that Bati generates apps that use the V1 design (https://vite-plugin-ssr.com/migration/v1-design) and Vike packages (https://vite-plugin-ssr.com/vike-packages)

import express from "express";
import compression from "compression";
import { configDotenv } from "dotenv";
import { renderPage } from "vite-plugin-ssr/server";
import { root } from "./root.js";
import mongoose from "mongoose";
import { router } from "./router.js";
const isProduction = process.env.NODE_ENV === "production";

configDotenv();

const app = express();

app.use(compression());

// Vite integration
if (isProduction) {
    // In production, we need to serve our static assets ourselves.
    // (In dev, Vite's middleware serves our static assets.)
    const sirv = (await import("sirv")).default;
    app.use(sirv(`${root}/dist/client`));
} else {
    // We instantiate Vite's development server and integrate its middleware to our server.
    // ⚠️ We instantiate it only in development. (It isn't needed in production and it
    // would unnecessarily bloat our production server.)
    const vite = await import("vite");
    const viteDevelopmentMiddleware = (
        await vite.createServer({
            root,
            server: { middlewareMode: true },
        })
    ).middlewares;
    app.use(viteDevelopmentMiddleware);
}

// ...
// Other middlewares (e.g. some RPC middleware such as Telefunc)
// ...

app.use(express.json());
app.use("/api", router);

// Vite-plugin-ssr middleware. It should always be our last middleware (because it's a
// catch-all middleware superseding any middleware placed after it).
app.get("*", async (req, res, next) => {
    const pageContextInit = {
        urlOriginal: req.originalUrl,
        redirectTo: "",
    };
    const pageContext = await renderPage(pageContextInit);
    const { redirectTo, httpResponse } = pageContext;
    if (redirectTo) {
        res.redirect(307, redirectTo);
    } else if (httpResponse) {
        const { body, statusCode, headers, earlyHints } = httpResponse;
        if (res.writeEarlyHints) res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) });
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("X-Frame-Options", "DENY");
        res.setHeader("X-XSS-Protection", "1");
        res.setHeader(
            "Content-Security-Policy",
            "default-src 'none'; script-src 'self'; connect-src 'self'; img-src 'self'; style-src 'self' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; frame-ancestors 'self'; form-action 'self'; base-uri 'none'; object-src 'none'"
        );
        for (const [name, value] of headers) res.setHeader(name, value);
        res.status(statusCode);
        // For HTTP streams use httpResponse.pipe() instead, see https://vite-plugin-ssr.com/stream
        res.send(body);
    } else {
        return next();
    }
});

const port = process.env.VITE_APP_PORT || 3000;
try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connexion MonboDB établie!");

    app.listen(port, () => console.log(`✅ L'application écoute sur http://localhost:${port}`));
} catch (error: any) {
    console.log("❌ Impossible de démarrer l'application Node", error.message);
}

export default app;

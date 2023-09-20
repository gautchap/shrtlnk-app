import ReactDOMServer from "react-dom/server";
import { PageShell } from "./PageShell";
import { escapeInject, dangerouslySkipEscape } from "vite-plugin-ssr/server";
// eslint-disable-next-line import/no-absolute-path
import logoUrl from "/assets/logo.svg";
// eslint-disable-next-line import/no-absolute-path
import twitterBg from "/assets/397fdd757c6bbcb0ddfc32af85352c09.jpg";
import type { PageContextServer } from "./types";
import { url } from "./fetcher";

export { render };
// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ["pageProps", "urlPathname"];

async function render(pageContext: PageContextServer) {
    const { Page, pageProps, urlPathname } = pageContext;

    const shortUrl = urlPathname.replace("/", "").trim();

    if (shortUrl) {
        const res = await fetch(`${url}/api/shorturl?url=${shortUrl}`);

        if (res.status === 404) {
            return {
                documentHtml: null,
                pageContext: {
                    redirectTo: "/",
                },
            };
        }

        const json = await res.json();
        const { longUrl } = await json;

        if (longUrl === "/") {
            return {
                documentHtml: null,
                pageContext: {
                    redirectTo: "/",
                },
            };
        }

        return {
            documentHtml: null,
            pageContext: {
                redirectTo: longUrl,
            },
        };
    }

    // This render() hook only supports SSR, see https://vite-plugin-ssr.com/render-modes for how to modify render() to support SPA
    if (!Page) throw new Error("My render() hook expects pageContext.Page to be defined");
    const pageHtml = ReactDOMServer.renderToString(
        <PageShell pageContext={pageContext}>
            <Page {...pageProps} />
        </PageShell>
    );

    // See https://vite-plugin-ssr.com/head
    const { documentProps } = pageContext.exports;
    const title = (documentProps && documentProps.title) || "Vite SSR app";
    const desc = (documentProps && documentProps.description) || "App using Vite + vite-plugin-ssr";

    const documentHtml = escapeInject`<!DOCTYPE html>
 <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <link rel="canonical" href="https://www.${import.meta.env.VITE_APP_DOMAIN}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Short Link" />
        <meta property="og:image" content="https://www.${import.meta.env.VITE_APP_DOMAIN}${twitterBg}" />
        <meta property="og:description" content="shorten your link easily and free of charge in 5 seconds" />
        <meta property="og:url" content="https://www.${import.meta.env.VITE_APP_DOMAIN}/" />
        <meta property="twitter:site" content="https://www.${import.meta.env.VITE_APP_DOMAIN}/"  />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Short Link" />
        <meta property="twitter:description" content="shorten your link easily and free of charge in 5 seconds" />
        <meta property="twitter:image" content="https://www.${import.meta.env.VITE_APP_DOMAIN}${twitterBg}"  />
        <meta property="twitter:image:src" content="https://www.${import.meta.env.VITE_APP_DOMAIN}${twitterBg}"  />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <title>${title}</title>
      </head>
      <body>
        <div id="react-root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

    return {
        documentHtml,
        pageContext: {
            // We can add some `pageContext` here, which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
        },
    };
}

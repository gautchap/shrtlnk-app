import { ReactElement } from "react";
import type {
    PageContextBuiltInServer,
    /*
  // When using Client Routing https://vite-plugin-ssr.com/clientRouting
  PageContextBuiltInClientWithClientRouting as PageContextBuiltInClient
  /*/
    // When using Server Routing
    PageContextBuiltInClientWithServerRouting as PageContextBuiltInClient,
    //*/
} from "vite-plugin-ssr/types";

export type { PageContextServer };
export type { PageContextClient };
export type { PageContext };
export type { PageProps };

type Page = (pageProps: PageProps) => ReactElement;
type PageProps = Record<string, unknown>;

export type PageContextCustom = {
    Page: Page;
    pageProps?: PageProps;
    urlPathname: string;
    exports: {
        documentProps?: {
            title?: string;
            description?: string;
        };
    };
    redirectTo: string;
};

type PageContextServer = PageContextBuiltInServer<Page> & PageContextCustom;
type PageContextClient = PageContextBuiltInClient<Page> & PageContextCustom;

type PageContext = PageContextClient | PageContextServer;

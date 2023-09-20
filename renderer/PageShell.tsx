import React from "react";
import { PageContextProvider } from "./usePageContext";
import type { PageContext } from "./types";
import "./PageShell.css";

export { PageShell };

type PageShellProps = {
    children: React.ReactNode;
    pageContext: PageContext;
};

function PageShell({ children, pageContext }: PageShellProps) {
    return (
        <React.StrictMode>
            <PageContextProvider pageContext={pageContext}>{children}</PageContextProvider>
        </React.StrictMode>
    );
}

import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { RightClickProvider } from "./context/Explorer/RightClickContext";
import { NotificationsProvider } from "@/context/Notifications/NotificationsContext.jsx";
import { UserProvider } from "./context/UserContext/UserContext";
import { Toaster } from "sonner";
import { SheetsProvider } from "@/context/SheetsContext/SheetsContext.jsx";
import { ExplorerUIProvider } from "./context/Explorer/ExplorerUIContext";
import { ExplorerDataProvider } from "./context/Explorer/ExplorerDataContext";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => ` ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <ExplorerUIProvider>
                <ExplorerDataProvider>
                    <NotificationsProvider>
                        <UserProvider>
                            <SheetsProvider>
                                <Toaster position="top-center" richColors />
                                <App {...props} />
                            </SheetsProvider>
                        </UserProvider>
                    </NotificationsProvider>
                </ExplorerDataProvider>
            </ExplorerUIProvider>
        );
    },
    progress: {
        color: "#4B5563",
    },
});

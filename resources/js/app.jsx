import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { ArchiveDataProvider } from "./context/ArchiveExplorer/ArchiveDataContext";
import { ArchiveUIProvider } from "./context/ArchiveExplorer/ArchiveUIContext";
import { RightClickProvider } from "./context/ArchiveExplorer/RightClickContext";
import { NotificationsProvider } from "@/context/Notifications/NotificationsContext.jsx";
import { UserProvider } from "./context/UserContext/UserContext";
import { Toaster } from "sonner";
import { SheetsProvider } from "@/context/SheetsContext/SheetsContext.jsx";

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
            <ArchiveUIProvider>
                <ArchiveDataProvider>
                    <RightClickProvider>
                        <NotificationsProvider>
                            <UserProvider>
                                <SheetsProvider>
                                    <Toaster position="top-center" richColors />
                                    <App {...props} />
                                </SheetsProvider>
                            </UserProvider>
                        </NotificationsProvider>
                    </RightClickProvider>
                </ArchiveDataProvider>
            </ArchiveUIProvider>
        );
    },
    progress: {
        color: "#4B5563",
    },
});

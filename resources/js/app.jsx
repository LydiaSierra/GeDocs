import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";

import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/zoom.css';

import { NotificationsProvider } from "@/context/Notifications/NotificationsContext.jsx";
import { UserProvider } from "./context/UserContext/UserContext";
import { SheetsProvider } from "@/context/SheetsContext/SheetsContext.jsx";
import { DependenciesProvider } from "./context/DependenciesContext/DependenciesContext";
import { Toaster } from "sonner";

const appName = "GeDocs"

createInertiaApp({
    title: (title) => ` ${appName}`,
    resolve: (name) => {
        return resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx"),
        );
    },

    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <NotificationsProvider>
                <UserProvider>
                    <SheetsProvider>
                        <DependenciesProvider>
                            <Toaster position="top-center" richColors closeButton expand={false} />
                            <App {...props} />
                        </DependenciesProvider>
                    </SheetsProvider>
                </UserProvider>
            </NotificationsProvider>
        );
    },

    progress: {
        color: "#4B5563",
    },
});

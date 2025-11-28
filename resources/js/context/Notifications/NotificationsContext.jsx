import { createContext, useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { router, usePage } from "@inertiajs/react";

export const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingDetailsNotification, setLoadingDetailsNotification] = useState(false)
    const [visibleDetails, setVisibleDetails] = useState(null);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        const res = await api.get("/api/notifications");
        if (res.data.succes === false) {
            console.log("ERRROR AL OBTENER NOTIFICACIONES!");
            return;
        }
        setNotifications(res.data.notifications);
        setLoading(false);
    });

    const markAsReadNotification = useCallback(async (id) => {
        setLoadingDetailsNotification(true)
        setNotifications((prev) =>
            prev.map((notification) =>
                notification.id === id
                    ? { ...notification, read_at: Date() }
                    : notification
            )
        );

        const res = await api.post(`/api/notifications/${id}/mark-as-read`);
        if (res.data.success === false) {
            console.log("ERRROR AL MARCAR NOTIFICACIONES LEIDAS!");
            return;
        }

       
        const resNotification = await api.get(`/api/notifications/${id}`);
        if (resNotification.data.success === false) {
            console.log("ERRROR AL RECIBIR LA NOTIFICACION!");
            return;
        }
        setVisibleDetails(resNotification.data.notification);
        setLoadingDetailsNotification(false)
       
    });

    const closeDetails = useCallback(() => {
        setVisibleDetails(null)
    })

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <NotificationsContext.Provider
            value={{
                notifications,
                markAsReadNotification,
                loading,
                visibleDetails,
                loadingDetailsNotification,
                closeDetails
            }}
        >
            {children}
        </NotificationsContext.Provider>
    );
}

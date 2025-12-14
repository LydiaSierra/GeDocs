import { createContext, useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { router, usePage } from "@inertiajs/react";

export const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingDetailsNotification, setLoadingDetailsNotification] =
        useState(false);
    const [visibleDetails, setVisibleDetails] = useState(null);
    const [notificationSeleted, setNotificationSeleted] = useState(null);
    const [userState, setUserState] = useState("");

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/notifications");

            if (!res.data || res.data.success === false) {
                console.log("ERROR AL OBTENER NOTIFICACIONES!", res.data?.message || "");
                setNotifications([]);
                setLoading(false);
                return;
            }

            setNotifications(res.data.notifications || []);
        } catch (error) {
            console.error("Error fetching notifications:", error?.response?.data || error.message || error);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const markAsReadNotification = useCallback(
        async (id) => {
            setNotificationSeleted(id);
            setLoadingDetailsNotification(true);
            setNotifications((prev) =>
                prev.map((notification) =>
                    notification.id === id
                        ? { ...notification, read_at: new Date().toISOString() }
                        : notification
                )
            );

            try {
                const res = await api.post(`/api/notifications/${id}/mark-as-read`);
                if (!res.data || res.data.success === false) {
                    console.log("ERROR AL MARCAR NOTIFICACIONES LEIDAS!", res.data?.message || "");
                }
            } catch (error) {
                console.error(error?.response?.data || error.message || error);
            } finally {
                setLoadingDetailsNotification(false);
            }
        },
        [notificationSeleted]
    );

    const closeDetails = useCallback(() => {
        setVisibleDetails(null);
    });

    const updateStatusUser = async (status) => {
        if (!visibleDetails || !visibleDetails.data || !visibleDetails.data.user) return;
        const userId = visibleDetails.data.user.id;
        try {
            const res = await api.put(`/api/users/${userId}`, {
                status: status,
            });

            console.debug("PUT /api/users response:", res.status, res.data);

            if (!res.data || res.data.success === false) {
                console.error("error al actualizar estado de la petición", res.data?.message || "");
                return;
            }

            console.log(res.data.message || "Usuario actualizado");

            // Actualizar el estado dentro de visibleDetails.data.user
            setVisibleDetails((prev) => ({
                ...prev,
                data: {
                    ...prev.data,
                    user: {
                        ...prev.data.user,
                        status,
                    },
                },
            }));

            closeDetails();
        } catch (error) {
            const statusCode = error?.response?.status;
            const serverMessage = error?.response?.data?.message || error.message;
            if (statusCode === 401 || statusCode === 403) {
                console.error("No autorizado para actualizar usuario:", statusCode, serverMessage);
            } else if (statusCode === 422) {
                console.error("Validación inválida:", error.response.data.errors || serverMessage);
            } else {
                console.error("error al hacer la petición:", serverMessage);
            }
        }
    };
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    return (
        <NotificationsContext.Provider
            value={{
                notifications,
                markAsReadNotification,
                loading,
                visibleDetails,
                setVisibleDetails,
                loadingDetailsNotification,
                closeDetails,
                fetchNotifications,
                notificationSeleted,
                updateStatusUser,
            }}
        >
            {children}
        </NotificationsContext.Provider>
    );
}

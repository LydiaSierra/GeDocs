import {createContext, useState, useEffect, useCallback} from "react";
import api from "@/lib/axios";
import {router, usePage} from "@inertiajs/react";

export const NotificationsContext = createContext();

export function NotificationsProvider({children}) {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const endpoint = filter ? `api/notifications/${filter}` : "/api/notifications"
            const res = await api.get(endpoint);

            if (res.data.success) {
                setNotifications(res.data.notifications);
            }

        } catch (err) {
            console.error(err)

        } finally {
            setLoading(false)
        }
    }, [filter]);

    const markAsRead = useCallback((id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? {...n, read_at: new Date().toISOString()} : n)
        )
    }, [])


    useEffect(() => {
        loadNotifications();
    }, [filter])


    return (
        <NotificationsContext.Provider
            value={{
                notifications,
                setNotifications,
                loading,
                markAsRead
            }}
        >
            {children}
        </NotificationsContext.Provider>
    );
}

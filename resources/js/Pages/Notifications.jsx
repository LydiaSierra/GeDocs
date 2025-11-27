import NotificationsLayout from "@/Layouts/NotificationsLayout.jsx";
import { usePage } from "@inertiajs/react";
import NotificationsList from "@/Components/Notifications/NotificationsList";
import NotificationSidebar from "@/Components/Notifications/NotificationSidebar";
import NotificationsCard from "@/Components/Notifications/NotificationsCard";
import { useState } from "react";

const Notifications = () => {

    
    const [details,setDetails]=useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedNotification, setSelectedNotification] = useState(null);
    
    
    // funcion que trata el cambio de visualizacion en los mensajes
    const handleSelectNotification = (id) => {
    setSelectedId(id);
    const temporalArray=temporalNotifications.map(noti =>
            noti.id === id
                ? { ...noti, read: true, selected: true }
                : { ...noti, selected: false }
        )

    setTemporalNotifications(temporalArray);

    setDetails(true);
};

    return (
        <NotificationsLayout>

            <NotificationSidebar 
                handleSelectNotification={handleSelectNotification}
            />

            {details && (
                <NotificationsCard 
                    handleSelectNotification={handleSelectNotification}
                    item={temporalNotifications.find(n => n.selected)}
                />
            )}

        </NotificationsLayout>
    );
}

export default Notifications;

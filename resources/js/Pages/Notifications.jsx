import NotificationsCard from "@/Components/Notifications/NotificationsCard";
import NotificationsLayout from "@/Layouts/NotificationsLayout.jsx";
import { usePage } from "@inertiajs/react";
import NotificationsList from "@/Components/Notifications/NotificationsList";

const Notifications = () => {


    return (
        <NotificationsLayout>
            <NotificationsCard/>
        </NotificationsLayout>
    );
}

export default Notifications;

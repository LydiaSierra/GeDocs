import NotificationsLayout from "@/Layouts/NotificationsLayout.jsx";
import { usePage } from "@inertiajs/react";
import NotificationsList from "@/Components/Notifications/NotificationsList";
import NotificationSidebar from "@/Components/Notifications/NotificationSidebar";
import NotificationsCard from "@/Components/Notifications/NotificationsCard";
import { useState } from "react";

const Notifications = () => {

    const [temporalNotifications, setTemporalNotifications]=useState([
        {
            id:1,
            solicitante: "Julio Alexis Hoyos",
            tipoDocumento: "Cédula de ciudadanía",
            numeroDocumento: "1234567890",
            correo: "julio@gmail.com",
            telefono: "3201234567",
            fecha: "08/09/2025",
            read: false,
            selected: false     

        },
        {
            id:2,
            solicitante: "María Fernanda López",
            tipoDocumento: "Cédula de ciudadanía",
            numeroDocumento: "9876543210",
            correo: "maria.fer@gmail.com",
            telefono: "3115678943",
            fecha: "12/09/2025",
            read: false,
            selected: false     
        },
        {
            id:3,
            solicitante: "Carlos Andrés Pardo",
            tipoDocumento: "Tarjeta de identidad",
            numeroDocumento: "1122334455",
            correo: "carlos.pardo@example.com",
            telefono: "3004567890",
            fecha: "02/09/2025",
            read: false,
            selected: false     
        },
        {
            id:4,
            solicitante: "Diana Carolina Ruiz",
            tipoDocumento: "Cédula de extranjería",
            numeroDocumento: "4455667788",
            correo: "diana.ruiz@example.com",
            telefono: "3159988776",
            fecha: "15/09/2025",
            read: false,
            selected: false     
        },
        {
            id:5,
            solicitante: "Santiago Morales Torres",
            tipoDocumento: "Cédula de ciudadanía",
            numeroDocumento: "5566778899",
            correo: "santi.morales@gmail.com",
            telefono: "3224455667",
            fecha: "10/09/2025",
            read: false,
            selected: false     
        }
    ])

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
        <NotificationsLayout
        temporalNotifications={temporalNotifications}>

            <NotificationSidebar 
            temporalNotifications={temporalNotifications}
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

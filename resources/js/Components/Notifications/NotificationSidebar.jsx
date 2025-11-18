import React, { useContext } from "react";
import { NotificationsContext } from "@/context/Notifications/NotificationsContext.jsx";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import NotificationsCard from "@/Components/Notifications/NotificationsCard.jsx";


const NotificationSidebar = () => {
    const { loading, notifications } = useContext(NotificationsContext);

    return (
        <>
            <aside className={"border-r w-[300px] h-full p-4 border-gray-500"}>

                {loading ?
                    <div className={"h-full flex justify-center items-center text-gray-400"}>
                        <ArrowPathIcon className={"w-6 animate-spin"} />
                    </div>
                    :
                    <>
                        {notifications.length > 0 ?
                            <>
                                {notifications.map((item) => {
                                    return (
                                        <NotificationsCard key={item.id} item={item} />
                                    )
                                })}
                            </>
                            :
                            <div className={"h-full flex justify-center items-center text-gray-400"}>
                                <h1>Sin notificaciones</h1>
                            </div>
                        }
                    </>
                }

            </aside>
        </>
    )
}


export default NotificationSidebar;

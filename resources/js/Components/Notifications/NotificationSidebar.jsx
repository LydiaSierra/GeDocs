import React, { useContext, useEffect } from "react";
import { NotificationsContext } from "@/context/Notifications/NotificationsContext.jsx";
import { PlusCircleIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import NotificationsCard from "@/Components/Notifications/NotificationsCard.jsx";
import EmptyState from "../EmptyState";


const NotificationSidebar = () => {

    const { notifications, markAsReadNotification, loading, notificationSeleted, setNotificationSeleted, fetchNotifications } = useContext(NotificationsContext);




    return (
        <div className={`${notificationSeleted ? "grid-cols-3 grid gap-2" : "flex flex-col gap-2"} mt-2 w-full h-full`}>
            <div className="col-span-1  overflow-y-auto">
                <div className="flex justify-between items-center flex-wrap gap-4 pr-6">
                    <h1 className="font-bold text-2xl text-black"> Solicitudes de instructores </h1>
                    <div className="cursor-pointer flex items-center gap-1" onClick={() => {
                        fetchNotifications();
                    }}>
                        <span className={`${loading ? "animate-spin" : ""}`}><ArrowPathIcon className="size-5" /></span>
                            Refrescar
                    </div>
                </div>


                {notifications.length > 0 ? (
                    <ul className="flex flex-col  gap-3 pr-2 mt-1 rounded-lg h-auto">

                        {/* condicionales para estilos dependiendo el estado de la notificacion */}
                        {notifications.map((item) => {
                            const isSelected = item.id === notificationSeleted
                            const isRead = item.read_at;
                            const isActive = item.data?.user?.status === "active";
                            const isRejected = item.data?.user?.status === "rejected";
                            return (
                                <li
                                    key={item.id}
                                    onClick={() => {
                                        if (!isSelected && !isRead) {
                                            markAsReadNotification(item.id);
                                        }
                                        setNotificationSeleted(isSelected ? null : item.id);
                                    }}
                                    className={`flex flex-row w-full h-auto border-y border-x-none cursor-pointer relative p-2 mt-1.5 rounded-xl hover:bg-[#6CF1F5]
                                ${isRead ? "text-[#848484]" : "text-black font-bold "}
                                ${isSelected ? "bg-[#6CF1F5]" : "bg-white"} ${isActive ? "text-green-800" : ""}`}
                                >

                                    <div className={`"w-full flex flex-col items-start gap-1" }`}>

                                        <h1 className={`text-[17px]`}>
                                            Nuevo {`${item?.data?.role || "instructor"}`}
                                        </h1>

                                        {/* texto de la notificacion */}
                                        <p className="text-[15px]"> Solicitud de acceso: </p>
                                        <p className="text-[15px]"> {`${item.data.user.name} desea solicitar un nuevo acceso con
                                el rol instructor en el sistema`} </p>

                                    </div>

                                    <p className={`absolute top-3 right-3 text-[12px]`}>
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </p>

                                    <PlusCircleIcon
                                        className={`${item.read_at ? "hidden" : "w-3 h-3 text-[#3CACBB] fill-[#3CACBB] rounded-[50%] bg-[#3CACBB] absolute -top-1.5 right-0"}`}
                                    />
                                    {(isRead && !isActive && !isSelected) && (
                                        <span className={` w-3 h-3 rounded-[50%] ${isRejected ? "bg-amber-400" : !isActive ? "bg-red-500" : ""} absolute -top-1.5 right-0`}>
                                        </span>
                                    )}


                                </li>
                            );
                        })}

                    </ul>
                ) : (
                    <div className="text-ray-500 flex items-center justify-center h-[50vh]  relative">
                        <EmptyState text={"Sin notificaciones"} />
                    </div>
                )}


            </div>

            {notificationSeleted && <NotificationsCard />}

        </div>


    );
}


export default NotificationSidebar;

import React, { useContext } from "react";
import { NotificationsContext } from "@/context/Notifications/NotificationsContext.jsx";
import {UserCircleIcon,PlusCircleIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import NotificationsCard from "@/Components/Notifications/NotificationsCard.jsx";


const NotificationSidebar = () => {

    const { notifications, markAsReadNotification, loading, visibleDetails, notificationSeleted} = useContext(NotificationsContext);

    if(loading){
        return(
            <div className="w-full flex flex-col items-center justify-center h-full"> 
                <ArrowPathIcon className="size-8 animate-spin"/>
                cargando..... 
            </div>
        )
    }


    return (
        <div className={`${visibleDetails ? "grid-cols-3 grid gap-2" : "flex flex-col gap-2"} mt-2 w-full`}>
            <div className="col-span-1">
                <h1 className="font-bold text-2xl text-black"> Solicitudes de instructores </h1>

                <ul className="flex flex-col gap-3 overflow-y-scroll pr-2 mt-1 rounded-lg h-auto">

                    {/* condicionales para estilos dependiendo el estado de la notificacion */}
                    {notifications.map((item) => {
                    
                        return (
                            <li
                                key={item.id}
                                onClick={() => {
                                    if(item.id !== notificationSeleted){

                                        markAsReadNotification(item.id);
                                    }
                                }}
                                className={`flex flex-row w-full h-auto border-y border-x-none cursor-pointer relative p-2 mt-1.5 rounded-xl
                                ${item.read_at ? "text-[#848484]" : "text-black font-bold "} 
                                hover:bg-[#6CF1F5]
                                ${notificationSeleted === item.id ? "bg-[#6CF1F5]" : "bg-white" }`}
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
                                className={`${item.read_at ? "hidden" : "w-3 h-3 text-[#3CACBB] fill-[#3CACBB] rounded-[50%] bg-[#3CACBB] absolute -top-1.5 right-0" }`}
                            />


                        </li>
                        );
                    })}

                </ul>
            </div>

            {visibleDetails && <NotificationsCard/>}
            
        </div>

    
    );
}


export default NotificationSidebar;

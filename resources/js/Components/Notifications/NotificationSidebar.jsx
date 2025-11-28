import React, { useContext } from "react";
import { NotificationsContext } from "@/context/Notifications/NotificationsContext.jsx";
import {UserCircleIcon,PlusCircleIcon } from "@heroicons/react/24/solid";
import NotificationsCard from "@/Components/Notifications/NotificationsCard.jsx";


const NotificationSidebar = () => {

    const {notifications, markAsReadNotification} = useContext(NotificationsContext);


    return (
        <div className="w-full h-full flex flex-col gap-2 mt-2">
            <h1 className="font-bold text-2xl text-black"> Solicitudes de instructores </h1>

            <ul className="w-full h-full flex flex-col gap-3 overflow-y-scroll pr-2 mt-1 rounded-lg">

                {/* condicionales para estilos dependiendo el estado de la notificacion */}
                {notifications.map((item) => {
                    let bgColor = "bg-white"; 
                    let borderColor = "border-transparent";
                    let textColor1 = "text-black";
                    let textColor2 = "text-[#606164]";
                    let textColor3 = "text-[#606164]";
                    let textColor4 = "text-[#010515]";

                    if (item?.read && !item?.selected) {
                    textColor1 = "text-[#848484]";             // leido
                    textColor2 = "text-[#606164]";             
                    textColor3 = "text-[#606164]";             
                    textColor4 = "text-[#606164]";             
                    }

                    if (item?.selected) {
                    bgColor = "bg-[#6CF1F5]";            // seleccionado
                    textColor1 = "text-[#404142]";
                    textColor2 = "text-[#606164]";
                    textColor3 = "text-[#606164]";
                    textColor4 = "text-[#404142]";
                    }

                    return (

                        <li
                            key={item.id}
                            onClick={() => markAsReadNotification(item.id)}
                            className={`flex flex-row w-full h-auto border-y border-x-none ${item.read_at ? "text-gray-500" : "text-black font-bold bg-[#6CF1F5]"} 
                            cursor-pointer relative hover:bg-[#6CF1F5]  p-2 mt-1.5 rounded-xl`}
                        >

                        <div className="w-full flex flex-col items-start gap-1">

                            <h1 className={`text-[16px] font-bold ${textColor1}`}>
                                {/* {item.solicitud === "instructor" ? "Nuevo Instructor" : "Nuevo Aprendiz"} */}
                                Nuevo instructor
                            </h1>

                            {/* texto de la notificacion */}
                            <p className="text-[13px]"> Solicitud de acceso: </p>
                            <p className="text-[13px]"> {`${item.data.user.name} desea solicitar un nuevo acceso con
                            el rol instructor en el sistema`} </p>

                        </div>

                        <p className={`absolute top-3 right-3 text-[12px] ${textColor4}`}>
                        {new Date(item.created_at).toLocaleDateString()}
                        </p>

                        <PlusCircleIcon
                            className={`${item.read_at ? "hidden" : "w-3 h-3 text-[#3CACBB] fill-[#3CACBB] rounded-[50%] bg-[#3CACBB] absolute -top-1.5 right-0" }`}
                        />
                        {/* {!item?.read && !item?.selected && (
                            <PlusCircleIcon
                                className="w-3 h-3 text-[#3CACBB] fill-[#3CACBB] rounded-[50%] bg-[#3CACBB] absolute -top-1.5 right-0"
                            />
                        )} */}

                    </li>
                    );
                })}

            </ul>
        </div>

    
    );
}


export default NotificationSidebar;

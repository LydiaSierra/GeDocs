import React, { useContext } from "react";
import { NotificationsContext } from "@/context/Notifications/NotificationsContext.jsx";
import {UserCircleIcon,PlusCircleIcon } from "@heroicons/react/24/solid";
import NotificationsCard from "@/Components/Notifications/NotificationsCard.jsx";


const NotificationSidebar = ({temporalNotifications,handleSelectNotification}) => {
    return (
        <div className="w-full h-full flex flex-col gap-2 mt-2">
            <h1 className="font-bold text-2xl text-black">Solicitudes de Instructor</h1>

            <ul className="w-full h-full flex flex-col gap-3 overflow-y-scroll pr-2 mt-1 rounded-lg">

                {temporalNotifications.map((item) => {

                    let bgColor = "bg-white"; 
                    let borderColor = "border-transparent";
                    let textColor1 = "text-black";
                    let textColor2 = "text-[#606164]";
                    let textColor3 = "text-[#606164]";
                    let textColor4 = "text-[#010515]";

                    if (item.read && !item.selected) {
                    textColor1 = "text-[#848484]";             // leido
                    textColor2 = "text-[#606164]";             
                    textColor3 = "text-[#606164]";             
                    textColor4 = "text-[#606164]";             
                    }

                    if (item.selected) {
                    bgColor = "bg-[#6CF1F5]";            // seleccionado
                    textColor1 = "text-[#404142]";
                    textColor2 = "text-[#606164]";
                    textColor3 = "text-[#606164]";
                    textColor4 = "text-[#404142]";
                    }

                    return (

                        <li
                            key={item.id}
                            onClick={() => handleSelectNotification(item.id)}
                            className={`flex flex-row w-full h-auto border-y border-x-none ${borderColor} ${bgColor} 
                            cursor-pointer relative hover:bg-[#6CF1F5] bg-[#6CF1F5] p-2 mt-1.5 rounded-xl`}
                        >

                        <div className="w-full flex flex-col items-start gap-1">

                            <h1 className={`text-[16px] font-bold ${textColor1}`}>
                                {item.solicitud === "instructor" ? "Nuevo Instructor" : "Nuevo Aprendiz"}
                            </h1>

                            <p className={`text-[13px] ${textColor2}`} >Solicitud de acceso:</p>
                            <p className={`text-[13px] ${textColor3}`}>{`${item.solicitante} solicita un nuevo acceso con
                            el rol instructor en el sistema`}</p>

                        </div>

                        <p className={`absolute top-3 right-3 text-[12px] ${textColor4}`}>
                        {item.fecha}
                        </p>

                        {!item.read && !item.selected && (
                            <PlusCircleIcon
                                className="w-3 h-3 text-[#3CACBB] fill-[#3CACBB] rounded-[50%] bg-[#3CACBB] absolute -top-1.5 right-0"
                            />
                        )}

                    </li>
                    );
                })}

            </ul>
        </div>

        
    /* <div className={"h-full flex flex-col gap-1.5 justify-start cursor-pointer items-center text-gray-400"}>
        
    //     {/* Ejemplo como profesor */
    //     <div className={"w-full bg-[#6CF1F5] p-1 mt-1.5 rounded-xl"}>
    //         <h1 className={"font-bold text-black"}> 
    //             Nuevo Instructor
    //         </h1>
            
    //         <h3 className={"text-gray-700 text-xm"}> 
    //             Solicitud de acceso
    //         </h3>
            
    //         <p className={"text-xs text-gray-500"}> 
    //             Julio Alexis Hoyos desea solicitar un nuevo acceso con el rol de instructor en el sistema.
    //         </p>
    //     </div>


    //     {/* Ejemplo de aprendiz */}
    //     <div className={"w-full bg-gray-200 p-1 mt-1.5 rounded-xl cursor-pointer hover:bg-[#6CF1F5]"}>
    //         <h1 className={"font-bold text-black"}> 
    //             Nuevo Aprendiz
    //         </h1>
            
    //         <h3 className={"text-gray-700 text-xm"}> 
    //             Solicitud de acceso
    //         </h3>
            
    //         <p className={"text-xs text-gray-500"}> 
    //             Johan Alexis Rendon desea solicitar un nuevo acceso con el rol de Aprendiz en el sistema.
    //         </p>
    //     </div>

    //     {/* Ejemplo de notificación sin leer */}
    //     <div className={"w-full bg-white p-1 mt-1.5 cursor-pointer rounded-xl hover:bg-[#6CF1F5]"}>
    //         <h1 className={"font-bold text-black"}> 
    //             Nuevo Instructor
    //         </h1>
            
    //         <h3 className={"text-gray-700 text-xm"}> 
    //             Solicitud de acceso
    //         </h3>
            
    //         <p className={"text-xs text-gray-500"}> 
    //             Sebastian castellanos desea solicitar un nuevo acceso con el rol de Instructor en el sistema.
    //         </p>
    //     </div>
        
    //     {/* <h1>Sin notificaciones</h1> */}
    // </div> */
    );
}


export default NotificationSidebar

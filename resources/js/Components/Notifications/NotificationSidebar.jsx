import React, { useContext } from "react";
import { NotificationsContext } from "@/context/Notifications/NotificationsContext.jsx";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import NotificationsCard from "@/Components/Notifications/NotificationsCard.jsx";


const NotificationSidebar = ({details,setDetails,temporalNotifications}) => {
    const { loading, notifications } = useContext(NotificationsContext);

    return (
        <>
            <aside className={" w-[300px] h-full p-3 border-gray-500"}>
                <h1 className={"font-bold text-xl"}> Detalles de solicitud de </h1>

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
                            <div className={"h-full flex flex-col gap-1.5 justify-start cursor-pointer items-center text-gray-400"}>
                                
                                {/* Ejemplo como profesor */}
                                <div className={"w-full bg-[#6CF1F5] p-1 mt-1.5 rounded-xl"}>
                                    <h1 className={"font-bold text-black"}> 
                                        Nuevo Instructor
                                    </h1>
                                    
                                    <h3 className={"text-gray-700 text-xm"}> 
                                        Solicitud de acceso
                                    </h3>
                                    
                                    <p className={"text-xs text-gray-500"}> 
                                        Julio Alexis Hoyos desea solicitar un nuevo acceso con el rol de instructor en el sistema.
                                    </p>
                                </div>


                                {/* Ejemplo de aprendiz */}
                                <div className={"w-full bg-gray-200 p-1 mt-1.5 rounded-xl cursor-pointer hover:bg-[#6CF1F5]"}>
                                    <h1 className={"font-bold text-black"}> 
                                        Nuevo Aprendiz
                                    </h1>
                                    
                                    <h3 className={"text-gray-700 text-xm"}> 
                                        Solicitud de acceso
                                    </h3>
                                    
                                    <p className={"text-xs text-gray-500"}> 
                                        Johan Alexis Rendon desea solicitar un nuevo acceso con el rol de Aprendiz en el sistema.
                                    </p>
                                </div>

                                {/* Ejemplo de notificación sin leer */}
                                <div className={"w-full bg-white p-1 mt-1.5 cursor-pointer rounded-xl hover:bg-[#6CF1F5]"}>
                                    <h1 className={"font-bold text-black"}> 
                                        Nuevo Instructor
                                    </h1>
                                    
                                    <h3 className={"text-gray-700 text-xm"}> 
                                        Solicitud de acceso
                                    </h3>
                                    
                                    <p className={"text-xs text-gray-500"}> 
                                        Sebastian castellanos desea solicitar un nuevo acceso con el rol de Instructor en el sistema.
                                    </p>
                                </div>
                                
                                {/* <h1>Sin notificaciones</h1> */}
                            </div>
                        }
                        <NotificationsCard 
                        details={details} 
                        setDetails={setDetails}
                        temporalNotifications={temporalNotifications}/>
                    </>
                }

            </aside>
        </>
    )
}


export default NotificationSidebar;

import { NotificationsContext } from "@/context/Notifications/NotificationsContext";
import React, { useContext, useState } from "react";
import { UserCircleIcon} from "@heroicons/react/24/outline"


const NotificationsCard = ({details,setDetails,temporalNotifications}) => {

    return (
        <>
            <div className="">
                {/* Ejemplo de detalle de la notificacion */}
                
                {/* {details && (temporalNotifications.map((item,index)=>(
                    <div className="notificationContainer bg-white flex flex-col w-full h-[120%] gap-3.5 p-3.5 mt-9 rounded-md">
                    <p className="font-semibold text-[#000000] text-2xl"> Solicitud de Acceso: <br />
                        El usuario Julio Alexis Hoyos solicita un nuevo acceso con el rol de instructor
                    </p>

                    <p className="font-semibold text-lg text-[#404142]"> 08/09/2025 </p>

                    
                    <div className="w-[760px] bg-[#F3F3F3] h-[250px] mx-auto p-6 rounded-md text-base">
                        <h1 className="font-semibold "> Información del solicitante: </h1>
                    
                        <div className="applicantInformation flex gap-6 mt-2.5">
                            
                            <div className="w-14 h-14 text-gray-700">
                                <UserCircleIcon className="h-full w-full"/>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-10 w-full">
                            
                                <div>
                                    <p className="font-black"> Solicitante </p>
                                    <p> Julio Alexis Hoyos </p>
                                </div>

                                <div>
                                    <p className="font-black"> Tipo de Documento </p>
                                    <p> Cedula de ciudadania </p>
                                </div>

                                <div>
                                    <p className="font-black"> Numero de documento </p>
                                    <p> 1234567890 </p>
                                </div>

                                <div>
                                    <p className="font-black"> Correo electronico </p>
                                    <p> julio@gmail.com</p>
                                </div>

                                <div>
                                    <p className="font-black"> Telefono de contacto </p>
                                    <p> 320 1234567 </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h1 className="text-center font-medium text-2xl "> ¿Desea permitir que este usuario ingrese como instructor?</h1>

                    <div className="flex mx-auto gap-4">
                        <button className="cursor-pointer border border-green-400 p-1.5 hover:bg-green-300 rounded-md"> Aceptar ✅</button>
                        <button className="cursor-pointer border border-red-500 p-1.5 hover:bg-red-400 rounded-md"> Rechazar ❌</button>
                    </div>
                </div>
                ))}
                 */}
                <div className="notificationContainer bg-white flex flex-col w-full h-[80%] gap-3.5 p-3.5 mt-9 rounded-md">
                    <p className="font-semibold text-[#000000] text-2xl"> Solicitud de Acceso: <br />
                        El usuario Julio Alexis Hoyos solicita un nuevo acceso con el rol de instructor
                    </p>

                    <p className="font-semibold text-lg text-[#404142]"> 08/09/2025 </p>

                    
                    <div className="w-[760px] bg-[#F3F3F3] h-[250px] mx-auto p-6 rounded-md text-base">
                        <h1 className="font-semibold "> Información del solicitante: </h1>
                    
                        <div className="applicantInformation flex gap-6 mt-2.5">
                            
                            <div className="w-14 h-14 text-gray-700">
                                <UserCircleIcon className="h-full w-full"/>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-10 w-full">
                            
                                <div>
                                    <p className="font-black"> Solicitante </p>
                                    <p> Julio Alexis Hoyos </p>
                                </div>

                                <div>
                                    <p className="font-black"> Tipo de Documento </p>
                                    <p> Cedula de ciudadania </p>
                                </div>

                                <div>
                                    <p className="font-black"> Numero de documento </p>
                                    <p> 1234567890 </p>
                                </div>

                                <div>
                                    <p className="font-black"> Correo electronico </p>
                                    <p> julio@gmail.com</p>
                                </div>

                                <div>
                                    <p className="font-black"> Telefono de contacto </p>
                                    <p> 320 1234567 </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h1 className="text-center font-medium text-2xl "> ¿Desea permitir que este usuario ingrese como instructor?</h1>

                    <div className="flex mx-auto gap-4">
                        <button className="cursor-pointer border border-green-400 p-1.5 hover:bg-green-300 rounded-md"> Aceptar ✅</button>
                        <button className="cursor-pointer border border-red-500 p-1.5 hover:bg-red-400 rounded-md"> Rechazar ❌</button>
                    </div>
                </div>
            </div>
        </>
    )
}


export default NotificationsCard;

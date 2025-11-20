import { NotificationsContext } from "@/context/Notifications/NotificationsContext";
import React, { useContext } from "react";


const NotificationsCard = () => {
    
    
    
    return (
        <>
            <div className="">
                {/* Ejemplo de detalle de la notificacion */}
                <div className="notificationContainer bg-white flex flex-col w-[130%]">
                    <p className="font-semibold text-[#000000] text-2xl"> Solicitud de Acceso: <br />
                        El usuario Julio Alexis Hoyos solicita un nuevo acceso con el rol de instructor
                    </p>

                    <p className="font-semibold text-lg text-[#404142]"> 08/09/2025 </p>

                    <div className="applicantInformation w-3xl  bg-gray-400">
                        <h1> Información del solicitante </h1>

                        <div>
                            <div>
                                <p> Solicitante </p>
                                <p> Julio Alexis Hoyos </p>
                            </div>

                            <div>
                                <p> Tipo de Documento </p>
                                <p> Cedula de ciudadania </p>
                            </div>

                            <div>
                                <p> Numero de documento </p>
                                <p> 1234567890 </p>
                            </div>

                            <div>
                                <p> Correo electronico </p>
                                <p> julio@gmail.com </p>
                            </div>

                            <div>
                                <p> Telefono de contacto </p>
                                <p> 320 1234567 </p>
                            </div>
                        </div>
                    </div>

                    <h1> ¿Desea permitir que este usuario ingrese como instructor?</h1>

                    <div>
                        <p>✅</p>
                        <p>❌</p>
                    </div>
                </div>
            </div>
        </>
    )
}


export default NotificationsCard;

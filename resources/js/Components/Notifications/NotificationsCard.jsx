import { NotificationsContext } from "@/context/Notifications/NotificationsContext";
import React, { useContext } from "react";


const NotificationsCard = ({item}) => {
    return (
        <>
            <div
                 className={`${item.read_at ? "text-gray-500" : "text-black font-bold"} p-2 rounded-lg my-2 shadow cursor-pointer hover:bg-gray-100`}
            >
                <h1>
                    {item.data.title || item.data.message}
                </h1>
                <p className={"text-sm line-clamp-1"}>
                    {item.data.description}
                </p>
                <p className={"text-xs text-gray-500 font-medium line-clamp-1 ml-1"}>
                    {item.data.message}
                </p>
            </div>

            {/* Ejemplo de detalle de la notificacion */}
            <div className="notificationContainer">
                <p> Solicitud de Acceso: <br />
                    El usuario Julio Alexis Hoyos solicita un nuevo acceso con el rol de instructor
                </p>

                <p> 08/09/2025 </p>

                <div className="applicantInformation">
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

        </>
    )
}


export default NotificationsCard;

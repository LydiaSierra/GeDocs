import { NotificationsContext } from "@/context/Notifications/NotificationsContext";
import React, { useContext, useState } from "react";
import { ArrowUturnLeftIcon, UserCircleIcon, ArrowPathIcon } from "@heroicons/react/24/solid";

const NotificationCard = () => {
    const {
        notifications,
        markAsReadNotification,
        loading,
        visibleDetails,
        loadingDetailsNotification,
        closeDetails,
    } = useContext(NotificationsContext);

    if (loadingDetailsNotification) {
        return(
            <div className="w-full flex flex-col items-center justify-center h-full">
                <ArrowPathIcon className="size-8 animate-spin" />
                cargando.....
            </div>
        )
        
    }

    return (
        <div className=" bg-white flex flex-col w-full h-[70%] gap-5 p-3.5 mt-13 rounded-md col-span-2">
            <div className="w-full h-auto flex flex-row justify-between">
                <button className="h-auto w-auto cursor-pointer rounded-[50%] hover:bg-gray-400 p-1 hover:text-white">
                    <ArrowUturnLeftIcon className="w-7 h-7" onClick={closeDetails}/>
                </button>
            </div>
            <p className="font-semibold text-[#000000] text-2xl">
                Solicitud de Acceso: <br />
                El usuario {visibleDetails.data.user.name} solicita un nuevo
                acceso con el rol de {visibleDetails.data.role}
            </p>

            <p className="font-semibold text-lg text-[#404142]">
                {new Date(visibleDetails.created_at).toLocaleDateString()}
            </p>

            <div className="bg-[#F3F3F3] w-full h-auto mx-auto p-6 rounded-md text-base">
                <h1 className="font-semibold ">
                    {" "}
                    Información del solicitante:{" "}
                </h1>

                <div className="flex gap-6 mt-2.5 w-full">
                    <div className="w-14 h-14 text-gray-700">
                        <UserCircleIcon className="h-full w-full" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-10 w-full">
                        <div>
                            <p className="font-black"> Solicitante </p>
                            <p> {visibleDetails.data.user.name} </p>
                        </div>

                        <div>
                            <p className="font-black"> Tipo de Documento </p>
                            <p> {visibleDetails.data.user.type_document} </p>
                        </div>

                        <div>
                            <p className="font-black"> Número de documento </p>
                            <p> {visibleDetails.data.user.document_number} </p>
                        </div>

                        <div>
                            <p className="font-black"> Correo electrónico </p>
                            <p> {visibleDetails.data.user.email} </p>
                        </div>

                        <div>
                            <p className="font-black"> Teléfono de contacto </p>
                            <p> Ninguno </p>
                        </div>
                    </div>
                </div>
            </div>
            <h1 className="text-center font-medium text-2xl ">
                {" "}
                ¿Desea permitir que este usuario ingrese como instructor?
            </h1>

            <div className="flex gap-[20%] w-full flex-row justify-center">
                <button className="cursor-pointer border border-green-400 p-1.5 hover:bg-green-300 rounded-md hover:text-white hover:border-none hover:text-shadow-2xs ">
                    {" "}
                    Aceptar
                </button>
                <button className="cursor-pointer border border-red-500 p-1.5 hover:bg-red-400 rounded-md hover:text-white hover:border-none hover:text-shadow-2xs">
                    {" "}
                    Rechazar
                </button>
            </div>
        </div>
    );
};

export default NotificationCard;

// const NotificationsCard = ({visibleDetails,handleSelectNotification}) => {
//     if (!item) return null;
//     return (
//         <>
//             <div className="notificationContainer bg-white flex flex-col w-full h-[87%] gap-5 p-3.5 mt-13 rounded-md">
//                 <div className="w-full h-auto flex flex-row justify-between">
//                     <button
//                         onClick={() => handleSelectNotification(null)}
//                         className="h-auto w-auto cursor-pointer rounded-[50%] hover:bg-gray-400 p-1 hover:text-white">
//                             <ArrowUturnLeftIcon className="w-7 h-7"/>
//                     </button>
//                 </div>
//                 <p className="font-semibold text-[#000000] text-2xl">
//                     Solicitud de Acceso: <br />
//                     El usuario  {item.solicitante} solicita un nuevo acceso con el rol de instructor
//                 </p>

//                 <p className="font-semibold text-lg text-[#404142]">{item.fecha}</p>

//                 <div className="w-[760px] bg-[#F3F3F3] h-[250px] mx-auto p-6 rounded-md text-base">
//                     <h1 className="font-semibold "> Información del solicitante: </h1>

//                     <div className="applicantInformation flex gap-6 mt-2.5">

//                         <div className="w-14 h-14 text-gray-700">
//                             <UserCircleIcon className="h-full w-full"/>
//                         </div>

//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-10 w-full">

//                             <div>
//                                 <p className="font-black"> Solicitante </p>
//                                 <p> {item.solicitante} </p>
//                             </div>

//                             <div>
//                                 <p className="font-black"> Tipo de Documento </p>
//                                 <p> {item.tipoDocumento} </p>
//                             </div>

//                             <div>
//                                 <p className="font-black"> Número de documento </p>
//                                 <p> {item.numeroDocumento} </p>
//                             </div>

//                             <div>
//                                 <p className="font-black"> Correo electrónico </p>
//                                 <p> {item.correo} </p>
//                             </div>

//                             <div>
//                                 <p className="font-black"> Teléfono de contacto </p>
//                                 <p> {item.telefono} </p>
//                             </div>

//                         </div>
//                     </div>
//                 </div>
//                 <h1 className="text-center font-medium text-2xl "> ¿Desea permitir que este usuario ingrese como instructor?</h1>

//                 <div className="flex gap-[20%] w-full flex-row justify-center">
//                     <button className="cursor-pointer border border-green-400 p-1.5 hover:bg-green-300 rounded-md hover:text-white hover:border-none hover:text-shadow-2xs "> Aceptar</button>
//                     <button className="cursor-pointer border border-red-500 p-1.5 hover:bg-red-400 rounded-md hover:text-white hover:border-none hover:text-shadow-2xs"> Rechazar</button>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default NotificationsCard;

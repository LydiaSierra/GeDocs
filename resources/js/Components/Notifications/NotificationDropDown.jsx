import { BellIcon,PlusCircleIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import api from "@/lib/axios.js";
import {Link, router, usePage} from "@inertiajs/react";

function NotificationDropDown() {
const [instructor,setInstructor]=useState([
    {
        nombre: "Juan Jose Peréz",
        solicitud:"instructor",
        fecha: "08/09/2025"
    },
    {
        nombre: "Juan Jose Peréz",
        solicitud:"instructor",
        fecha: "08/09/2025"
    },
    {
        nombre: "Juan Jose Peréz",
        solicitud:"instructor",
        fecha: "08/09/2025"
    }
])

const [aprendiz,setAprendiz]=useState([
    {
        nombre: "Juan Jose Peréz",
        solicitud:"aprendiz",
        fecha: "08/09/2025"
    },
    {
        nombre: "Juan Jose Peréz",
        solicitud:"aprendiz",
        fecha: "08/09/2025"
    }
])
  return (
    <div>
        <div className="dropdown dropdown-end h-full ">
            <div tabIndex={0} role="button" className="self-center bg-none cursor-pointer ">
                <BellIcon className="text-[#848484] w-8 h-8 bg-none cursor-pointer rounded-md fill-none hover:bg-gray-300"/>
            </div>

            <ul
                tabIndex="20"
                className="dropdown-content bg-white rounded-box z-10 w-120 max-h-96 py-2 pr-5  shadow-md flex flex-col 
                    gap-5 overflow-y-scroll overflow-x-hidden"
            >
                <li className="flex flex-col w-full h-[50%] gap-8 hover:bg-none">

                    <div className="w-[95%] self-center pl-3 h-auto border-b-2 border-black rounded-none">
                        <h2 className="text-[20px] text-black font-normal">Solicitudes Instructores</h2>
                    </div>

                    <ul className="w-full h-auto">
                        {instructor.map((item,index)=>(
                        <li key={index} className="flex flex-row p-2 w-full gap-2 h-auto border-y border-x-none boder-[#DBDBDB] 
                        relative">

                            <UserCircleIcon className="w-13 h-13 self-start text-[#404142]"/>

                            <div className="w-[80%] h-full flex flex-col items-start gap-1">
                                <h1 className="text-[16px] font-semibold">Nuevo Instructor</h1>
                                <p className="text-[13px]">Solicitud de Acceso:</p>
                                <p className="text-[13px]">{`${item.nombre} solicita un nuevo acceso con...`}</p>
                            </div>

                            <div className="w-[10%] h-full flex justify-end items-start ">
                                <p className=" text-black font-medium text-[12px] absolute top-5 right-3">{item.fecha}</p>
                            </div>

                            <PlusCircleIcon className="w-4.5 h-4.5 fill-[#3CACBB] text-[#3CACBB] border-none absolute -top-3 right-1 "/>

                        </li>
                        ))}
                        
                    </ul>
                    <Link className="w-full flex justify-center" href={route("notifications.index")}>
                        <button className="self-center cursor-pointer w-[40%] h-10 bg-none border-2 flex justify-center items-center 
                        border-solid border-[#848484] rounded-2xl hover:border-none hover:bg-[#848484] hover:text-white">
                        Todas las Solicitudes</button>
                    </Link>
                </li>
                
                {/* Aprendices */}
                <li className="flex flex-col w-full h-[50%] gap-8 hover:bg-none">

                    <div className="w-[95%] self-center pl-3 h-auto border-b-2 border-black rounded-none">
                        <h2 className="text-[20px] text-black font-normal">Solicitudes Aprendices</h2>
                    </div>

                    <ul className="w-full h-auto">
                        {aprendiz.map((item,index)=>(
                        <li key={index} className="flex flex-row p-2 w-full gap-2 h-auto border-y border-x-none boder-[#DBDBDB] 
                        relative">

                            <UserCircleIcon className="w-13 h-13 self-start text-[#404142]"/>

                            <div className="w-[80%] h-full flex flex-col items-start gap-1">
                                <h1 className="text-[16px] font-semibold">Nuevo Aprendiz</h1>
                                <p className="text-[13px]">Solicitud de Acceso:</p>
                                <p className="text-[13px]">{`${item.nombre} solicita un nuevo acceso con...`}</p>
                            </div>

                            <div className="w-[10%] h-full flex justify-end items-start ">
                                <p className=" text-black font-medium text-[12px] absolute top-5 right-3">{item.fecha}</p>
                            </div>

                            <PlusCircleIcon className="w-4.5 h-4.5 fill-[#3CACBB] text-[#3CACBB] border-none absolute -top-3 right-1 "/>

                        </li>
                        ))}
                        
                    </ul>
                    <Link className="w-full flex justify-center" href={route("notifications.index")}>
                        <button className="self-center cursor-pointer w-[40%] h-10 bg-none border-2 flex justify-center items-center 
                        border-solid border-[#848484] rounded-2xl hover:border-none hover:bg-[#848484] hover:text-white">
                        Todas las Solicitudes</button>
                    </Link>
                    
                </li>
            </ul>



        </div>
    </div>
  )
}

export default NotificationDropDown
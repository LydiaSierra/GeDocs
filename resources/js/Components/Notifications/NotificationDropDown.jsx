import {
    BellIcon,
    PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { useState, useContext } from "react";
import api from "@/lib/axios.js";
import { Link, router, usePage } from "@inertiajs/react";
import NotificationSidebar from "./NotificationSidebar";
import { NotificationsContext } from "@/context/Notifications/NotificationsContext.jsx";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const NotificationDropDown = () => {
    const { notifications, markAsReadNotification, loading, visibleDetails } =
        useContext(NotificationsContext);

    const [solicitudAprendiz, setSolicitudAprendiz] = useState(false);
    const [solicitudInstructor, setSolicitudInstructor] = useState(false);

    return (
        <>
            <div className="dropdown dropdown-end">
                <div
                    tabIndex={0}
                    role="button"
                    className="self-center bg-none cursor-pointer"
                >
                    <BellIcon className="text-[#848484] 
                    w-5 h-5 md:w-8 md:h-8 sm:w-7 sm:h-7 bg-none cursor-pointer rounded-md fill-none hover:bg-gray-300" />
                </div>

                <ul
                    className="dropdown-content bg-base-100 rounded-box z-1 p-2 shadow-sm md:w-max w-auto overflow-auto"
                >
                    <li className="flex flex-col md:w-full sm:w-80 w-65 h-[50%] gap-8 hover:bg-none">
                        <div className="w-[95%] self-center pl-3 h-auto border-b-2 border-black rounded-none">
                            <h2 className="text-xl text-black font-normal">
                                Solicitudes Instructores
                            </h2>
                        </div>

                        <ul className="w-full h-auto">
                            {notifications
                                .filter((item) => (item.read_at === null ))
                                .map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex flex-row py-2 w-full gap-2 h-auto border-y border-x-none boder-[#DBDBDB] 
                                        relative hover:bg-accent cursor-pointer"
                                    >
                                        <UserCircleIcon className="md:w-13 md:h-13 w-12 h-12 self-start text-[#404142]" />

                                        <div className="w-[80%] h-full flex flex-col items-start gap-1">
                                            <h1 className="text-2xs md:text-lg font-semibold">
                                                Nuevo Instructor
                                            </h1>
                                            <p className="text-xs md:text-sm font-medium">
                                                Solicitud de Acceso:
                                            </p>
                                            <p className="text-xs md:text-sm font-medium">{`${item.data.user.name} solicita un nuevo acceso con...`}</p>
                                        </div>

                                        <div className="w-[10%] h-full flex justify-end items-start ">
                                            <p className=" text-[#404142] font-medium text-xs absolute md:top-5 top-[15%] right-3">
                                                {new Date(
                                                    item.created_at
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <PlusCircleIcon className="md:w-4.5 w-3.5 md:h-4.5 h-3.5 fill-[#3CACBB] text-[#3CACBB] border-none absolute md:-top-3 -top-2 right-1 " />
                                    </li>
                                ))}
                        </ul>
                        <Link
                            className="w-full flex justify-center"
                            href={route("notifications.index")}
                        >
                            <button
                                className="self-center font-semibold cursor-pointer md:text-lg text-xs md:w-auto w-40 py-1 md:px-2 bg-none border flex justify-center 
                                items-center border-solid border-[#848484] rounded-xl hover:border-none hover:bg-[#848484] hover:text-white"
                                onClick={() => setSolicitudInstructor(true)}
                            >
                                Todas las Solicitudes
                            </button>
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default NotificationDropDown;

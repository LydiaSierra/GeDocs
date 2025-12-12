import {
    UserCircleIcon,
    AcademicCapIcon,
    ListBulletIcon,
} from "@heroicons/react/24/outline";
import { useContext, useState } from "react";

function SettingsBar() {
    const { notifications, markAsReadNotification, loading, visibleDetails } =
        useContext(NotificationsContext);
    const { content, setContent } = useContext(UserContext);

    return (
        <div className="w-[23%] bg-white mt-5 rounded-lg flex flex-col items-center gap-1">
            {/* Perlfil Info */}

            <div className="w-full h-auto flex flex-col  items-start gap-2">
                <div className="w-5/5 flex flex-col items-start gap-5 p-2">
                    <a href="#">
                        <div
                            className="flex flex-row items-center cursor-pointer gap-2 w-full text-[#010515] text-lg 
                        font-medium hover:underline"
                        >
                            <UserCircleIcon className="text-[#848484] w-10 h-10" />
                            <a href={route("profile.edit")}>
                                Informacion de Perfil
                            </a>
                        </div>
                    </a>
                </div>
            </div>

            {/* Users */}
            <div className="w-5/5 flex flex-col items-start gap-5 p-2">
                <h1 className="self-start text-[20px] text-[#848484]">
                    Usuarios
                </h1>

                <div className="w-full h-auto flex flex-col  items-start gap-2">
                    <a href={route("aprendiz")}>
                        <div
                            className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline"
                            onClick={() => {
                                setContent("Dependencia");
                            }}
                        >
                            <AcademicCapIcon className="text-[#848484] w-10 h-10" />
                            Aprendices
                        </div>
                    </a>

                    <NavLink
                        href={route("instructor")}
                        active={route().current("instructor")}
                    >
                        <div
                            className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline"
                            onClick={() => {
                                setContent("Instructor");
                            }}
                        >
                            <ListBulletIcon className="text-[#848484] w-10 h-10" />
                            Instructores
                        </div>
                    </NavLink>

                    <a href={route("sheets")}>
                        <div
                            className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline"
                            onClick={() => {
                                setContent("Ficha");
                            }}
                        >
                            <UserCircleIcon className="text-[#848484] w-10 h-10" />
                            Fichas
                        </div>
                    </a>
                </div>
            </div>

            {/* request */}

            <div className="w-5/5 flex flex-col items-start gap-5 p-2">
                <h1 className="self-start text-[20px] text-[#848484]">
                    Solicitudes
                </h1>

                <div className="w-full h-auto flex flex-col  items-start gap-2">
                    <a href={route("notifications.index")}>
                        <div className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline">
                            <UserCircleIcon className="text-[#848484] w-10 h-10" />
                            Aprendices
                        </div>
                    </a>

                    <a href={route("notifications.index")}>
                        <div className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline">
                            <UserCircleIcon className="text-[#848484] w-10 h-10" />
                            Instructores
                        </div>
                    </a>
                </div>
            </div>

            {/* Document manage */}

            <div className="w-5/5 flex flex-col items-start gap-5 p-2">
                <h1 className="self-start text-[20px] text-[#848484]">
                    Gestion Documental
                </h1>

                <div className="w-full h-auto flex flex-col  items-start gap-2">
                    <a href="#">
                        <div className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline">
                            <UserCircleIcon className="text-[#848484] w-10 h-10" />
                            Dependencias
                        </div>
                    </a>

                    <a href="#">
                        <div className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline">
                            <UserCircleIcon className="text-[#848484] w-10 h-10" />
                            Series y Subseries
                        </div>
                    </a>

                    <a href="#">
                        <div className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline">
                            <UserCircleIcon className="text-[#848484] w-10 h-10" />
                            Secciones y Subsecciones
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}
import { UserContext } from "@/context/UserContext/UserContext";
import { NotificationsContext } from "@/context/Notifications/NotificationsContext";
import NavLink from "../NavLink";

export default SettingsBar;

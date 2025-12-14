import {
    UserCircleIcon,
    AcademicCapIcon,
    ListBulletIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { UserContext } from "@/context/UserContext/UserContext";
import { NotificationsContext } from "@/context/Notifications/NotificationsContext";
import NavLink from "../NavLink";
import { usePage } from "@inertiajs/react";

function SettingsBar({ url }) {
    const { notifications, markAsReadNotification, visibleDetails } =
        useContext(NotificationsContext);
    const { content, setContent } = useContext(UserContext);
    const { auth } = usePage().props;

    const rol = auth.user.roles[0].name;
    console.log(rol);

    if (url === "/profile") {
        return (
            <div className="lg:block hidden w-[23%] h-auto">
                <div className="lg:w-full w-auto bg-white mt-5 px-2 rounded-lg flex flex-col items-center overflow-hidden">
                    {/* Perfil Info */}
                    <NavLink
                        href={route("profile.edit")}
                        className="w-full h-auto flex flex-row  items-start"
                    >
                        <div className="w-full flex flex-row items-start p-2">
                            <div
                                className={`flex flex-row items-center cursor-pointer gap-2 w-full text-[#010515] 
                                lg:text-lg md:text-md text-xs
                        font-medium hover:underline ${
                            url === "/profile" ? "underline" : ""
                        }`}
                            >
                                <UserCircleIcon className="text-[#848484] md:w-8 md:h-8 w-7 h-7 lg:w-9 lg:h-8" />
                                Informacion de Perfil
                            </div>
                        </div>
                    </NavLink>

                    {/* Users */}
                    {rol === "Admin" && (
                        <div className="w-full flex flex-col items-start gap-2 px-2">
                            <h1 className="self-start text-xs md:text-md lg:text-xl text-[#848484]">
                                Usuarios
                            </h1>

                            <div className="w-full h-auto flex flex-col items-start gap">
                                <NavLink href={route("aprendiz")}>
                                    <div
                                        className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] 
                            lg:text-lg md:text-md text-xs font-medium hover:underline"
                                        onClick={() => {
                                            setContent("Dependencia");
                                        }}
                                    >
                                        <AcademicCapIcon className="text-[#848484] md:w-8 md:h-8 w-7 h-7 lg:w-9 lg:h-8" />
                                        Aprendices
                                    </div>
                                </NavLink>

                                <NavLink
                                    href={route("instructor")}
                                    active={route().current("instructor")}
                                >
                                    <div
                                        className="flex flex-row items-center cursor-pointer gap-3 w-full
                             text-[#010515] lg:text-lg md:text-md text-xs font-medium hover:underline"
                                        onClick={() => {
                                            setContent("Instructor");
                                        }}
                                    >
                                        <ListBulletIcon className="text-[#848484]  md:w-8 md:h-8 w-7 h-7 lg:w-9 lg:h-8" />
                                        Instructores
                                    </div>
                                </NavLink>

                                <NavLink href={route("sheets")}>
                                    <div
                                        className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] lg:text-lg md:text-md text-xs
                             font-medium hover:underline"
                                    >
                                        <UserCircleIcon className="text-[#848484] md:w-8 md:h-8 w-7 h-7 lg:w-9 lg:h-8" />
                                        Fichas
                                    </div>
                                </NavLink>
                            </div>
                        </div>
                    )}

                    {/* request */}

                    <div className="w-5/5 flex flex-col items-start gap-5 p-2">
                        <h1 className="self-start text-xl text-[#848484]">
                            Solicitudes
                        </h1>

                        <div className="w-full h-auto flex flex-col  items-start gap-2">
                            {rol !== "Dependencia" && (
                                <NavLink href={route("notifications.index")}>
                                    <div className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline">
                                        <UserCircleIcon className="text-[#848484] md:w-8 md:h-8 w-7 h-7 lg:w-9 lg:h-8" />
                                        Aprendices
                                    </div>
                                </NavLink>
                            )}

                            {rol === "Admin" && (
                                <NavLink href={route("notifications.index")}>
                                    <div
                                        className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] lg:text-lg md:text-md text-xs
                             font-medium hover:underline"
                                    >
                                        <UserCircleIcon className="text-[#848484] md:w-8 md:h-8 w-7 h-7 lg:w-9 lg:h-8" />
                                        Instructores
                                    </div>
                                </NavLink>
                            )}
                        </div>
                    </div>

                    {/* Document Manage */}
                    <div className="w-full flex flex-col items-start gap-5 p-2">
                        <h1 className="self-start text-xl text-[#848484]">
                            Gestion Documental
                        </h1>

                        <div className="w-full h-auto flex flex-col  items-start gap-2">
                            <div>
                                <div
                                    className="flex flex-row items-center cursor-pointer gap-2 w-full text-[#010515] lg:text-lg md:text-md text-xs
                             font-medium hover:underline"
                                >
                                    <UserCircleIcon className="text-[#848484] md:w-8 md:h-8 w-7 h-7 lg:w-9 lg:h-8" />
                                    Dependencias
                                </div>
                            </div>

                            <div>
                                <div
                                    className="flex flex-row items-center cursor-pointer gap-2 w-full text-[#010515] lg:text-lg md:text-md text-xs
                             font-medium hover:underline"
                                >
                                    <UserCircleIcon className="text-[#848484] md:w-8 md:h-8 w-7 h-7 lg:w-9 lg:h-8" />
                                    Series y Subseries
                                </div>
                            </div>

                            <div>
                                <div
                                    className="flex flex-row items-center cursor-pointer gap-2 w-full text-[#010515] lg:text-lg md:text-md text-xs
                             font-medium hover:underline"
                                >
                                    <UserCircleIcon className="text-[#848484] md:w-8 md:h-8 w-7 h-7 lg:w-9 lg:h-8" />
                                    Secciones y Subsecciones
                                </div>
                            </div>

                            <h1 className="self-start text-xl text-[#848484]">
                                Editar Perfil
                            </h1>

                            <div>
                                <div
                                    className="flex flex-row items-center cursor-pointer gap-2 w-full text-[#010515] lg:text-lg md:text-md text-xs
                             font-medium hover:underline"
                                >
                                    <PencilSquareIcon className="text-[#848484] md:w-8 md:h-8 w-7 h-7 lg:w-9 lg:h-8" />
                                    Cambiar Contraseña
                                </div>
                            </div>

                            <div>
                                <div
                                    className="flex flex-row items-center cursor-pointer gap-2 w-full text-[#010515] lg:text-lg md:text-md text-xs
                             font-medium hover:underline"
                                >
                                    <TrashIcon className="text-[#848484] md:w-8 md:h-8 w-7 h-7 lg:w-9 lg:h-8" />
                                    Eliminar Cuenta
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="hidden lg:block w-[23%] h-auto">
                <div className="w-full bg-white mt-5 rounded-lg flex flex-col items-center gap-1">
                    {/* Perlfil Info */}

                    <NavLink
                        href={route("profile.edit")}
                        className="w-full h-auto flex flex-col  items-start gap-2"
                    >
                        <div className="w-5/5 flex flex-col items-start gap-5 p-2">
                            <div
                                className={`flex flex-row items-center cursor-pointer gap-2 w-full text-[#010515] text-lg 
                        font-medium hover:underline ${
                            url === "/profile" ? "underline" : ""
                        }`}
                            >
                                <UserCircleIcon className="text-[#848484] w-10 h-10" />
                                Informacion de Perfil
                            </div>
                        </div>
                    </NavLink>

                    {/* Users */}
                    {rol === "Admin" && (
                        <div className="w-5/5 flex flex-col items-start gap-5 p-2">
                            <h1 className="self-start text-[20px] text-[#848484]">
                                Usuarios
                            </h1>

                            <div className="w-full h-auto flex flex-col  items-start gap-2">
                                <NavLink href={route("aprendiz")}>
                                    <div
                                        className={`flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg
                             font-medium hover:underline ${
                                 url === "/users/aprendiz" ? "underline" : ""
                             }`}
                                        onClick={() => {
                                            setContent("Dependencia");
                                        }}
                                    >
                                        <AcademicCapIcon className="text-[#848484] w-10 h-10" />
                                        Aprendices
                                    </div>
                                </NavLink>

                                <NavLink
                                    href={route("instructor")}
                                    active={route().current("instructor")}
                                >
                                    <div
                                        className={`flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg
                             font-medium hover:underline ${
                                 url === "/users/instructor" ? "underline" : ""
                             }`}
                                        onClick={() => {
                                            setContent("Instructor");
                                        }}
                                    >
                                        <ListBulletIcon className="text-[#848484] w-10 h-10" />
                                        Instructores
                                    </div>
                                </NavLink>

                                <NavLink href={route("sheets")}>
                                    <div
                                        className={`flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline ${
                                            url === "/sheets" ? "underline" : ""
                                        }`}
                                    >
                                        <UserCircleIcon className="text-[#848484] w-10 h-10" />
                                        Fichas
                                    </div>
                                </NavLink>
                            </div>
                        </div>
                    )}

                    {/* request */}

                    <div className="w-5/5 flex flex-col items-start gap-5 p-2">
                        <h1 className="self-start text-[20px] text-[#848484]">
                            Solicitudes
                        </h1>

                        <div className="w-full h-auto flex flex-col  items-start gap-2">
                            {rol !== "Dependencia" && (
                                <NavLink href={route("notifications.index")}>
                                    <div
                                        className={`flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline ${
                                            url === "/notifications"
                                                ? "underline"
                                                : ""
                                        }`}
                                    >
                                        <UserCircleIcon className="text-[#848484] w-10 h-10" />
                                        Aprendices
                                    </div>
                                </NavLink>
                            )}

                            {rol === "Admin" && (
                                <NavLink href={route("notifications.index")}>
                                    <div className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline">
                                        <UserCircleIcon className="text-[#848484] w-10 h-10" />
                                        Instructores
                                    </div>
                                </NavLink>
                            )}
                        </div>
                    </div>

                    {/* Document manage */}

                    <div className="w-5/5 flex flex-col items-start gap-5 p-2">
                        <h1 className="self-start text-[20px] text-[#848484]">
                            Gestion Documental
                        </h1>

                        <div className="w-full h-auto flex flex-col  items-start gap-2">
                            <div>
                                <div className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline">
                                    <UserCircleIcon className="text-[#848484] w-10 h-10" />
                                    Dependencias
                                </div>
                            </div>

                            <div>
                                <div className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline">
                                    <UserCircleIcon className="text-[#848484] w-10 h-10" />
                                    Series y Subseries
                                </div>
                            </div>

                            <div>
                                <div className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline">
                                    <UserCircleIcon className="text-[#848484] w-10 h-10" />
                                    Secciones y Subsecciones
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SettingsBar;

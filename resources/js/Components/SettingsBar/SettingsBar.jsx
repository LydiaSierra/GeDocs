import {
    UserCircleIcon,
    AcademicCapIcon,
    ListBulletIcon,
} from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { UserContext } from "@/context/UserContext/UserContext";
import { NotificationsContext } from "@/context/Notifications/NotificationsContext";
import NavLink from "../NavLink";
import { usePage } from "@inertiajs/react";

function SettingsBar() {
    const { setContent } = useContext(UserContext);
    const { auth } = usePage().props;
    const { url } = usePage();

    const rol = auth.user.roles[0].name;
    return (
        <div className="hidden lg:block w-max h-full pt-5">
            <div className="w-full h-full bg-white rounded-lg flex whitespace-nowrap flex-col items-center overflow-y-auto">
                {/* Perlfil Info */}

                <NavLink
                    href={route("profile.edit")}
                    className="w-full h-auto flex flex-col  items-start gap-1"
                >
                    <div className="w-full flex flex-col items-start p-1">
                        <div
                            className={`flex flex-row items-center cursor-pointer gap-2 w-full text-[#010515] text-lg 
                        font-medium hover:underline ${
                            url === "/profile" ? "underline" : ""
                        }`}
                        >
                            <UserCircleIcon className="text-[#848484] size-8" />
                            Informacion de Perfil
                        </div>
                    </div>
                </NavLink>

                {/* Users */}
                {rol === "Admin" && (
                    <div className="w-5/5 flex flex-col items-start gap-5 p-1">
                        <h1 className="self-start text-md text-[#848484]">
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
                                    <AcademicCapIcon className="text-[#848484] size-8" />
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
                                    <ListBulletIcon className="text-[#848484] size-8" />
                                    Instructores
                                </div>
                            </NavLink>

                            <NavLink href={route("sheets")}>
                                <div
                                    className={`flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline ${
                                        url === "/sheets" ? "underline" : ""
                                    }`}
                                >
                                    <UserCircleIcon className="text-[#848484] size-8" />
                                    Fichas
                                </div>
                            </NavLink>
                        </div>
                    </div>
                )}

                {/* request */}

                <div className="w-5/5 flex flex-col items-start gap-5 p-1">
                    <h1 className="self-start text-md text-[#848484]">
                        Solicitudes
                    </h1>

                    <div className="w-full h-auto flex flex-col  items-start gap-2">
                        {rol === "Admin" && (
                            <NavLink href={route("notifications.index")}>
                                <div
                                    className={`flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline ${
                                        url === "/notifications"
                                            ? "underline"
                                            : ""
                                    }`}
                                >
                                    <UserCircleIcon className="text-[#848484] size-8 " />
                                    Solicitudes
                                </div>
                            </NavLink>
                        )}
                    </div>
                </div>

                {/* Document manage */}

                <div className="w-5/5 flex flex-col items-start gap-5 p-2">
                    <h1 className="self-start text-md text-[#848484]">
                        Gestion Documental
                    </h1>

                    <div className="w-full h-auto flex flex-col  items-start gap-2">
                        <div>
                            <div className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline">
                                <UserCircleIcon className="text-[#848484] size-8" />
                                Dependencias
                            </div>
                        </div>

                        <div>
                            <div className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline">
                                <UserCircleIcon className="text-[#848484] size-8" />
                                Series y Subseries
                            </div>
                        </div>

                        <div>
                            <div className="flex flex-row items-center cursor-pointer gap-3 w-full text-[#010515] text-lg font-medium hover:underline">
                                <UserCircleIcon className="text-[#848484] size-8" />
                                Secciones y Subsecciones
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsBar;

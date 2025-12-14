import {
    UserCircleIcon,
    AcademicCapIcon,
    ListBulletIcon,
} from "@heroicons/react/24/outline";

import NavLink from "@/Components/NavLink";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext/UserContext";

function HamburguerMenu({ url }) {
    const { setContent } = useContext(UserContext);
    return (
        <div className={`lg:hidden block `}>
            <div className={`flex items-center gap-3`}>
                <div className={`dropdown lg:hidden`}>
                    <div
                        tabIndex={0}
                        role="button"
                        className={`btn btn-ghost btn-circle`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className={`inline-block h-7 w-7 stroke-current`}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </div>

                    <ul
                        tabIndex={-1}
                        className={`menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-56 p-2 shadow`}
                    >
                        {/* Perfil */}
                        <li>
                            <NavLink href={route("profile.edit")}>
                                <div
                                    className={`flex items-center gap-2 text-sm font-medium text-[#010515] hover:underline ${
                                        url === "/profile" ? "underline" : ""
                                    }`}
                                >
                                    <UserCircleIcon
                                        className={`w-5 h-5 text-[#848484]`}
                                    />
                                    Información de Perfil
                                </div>
                            </NavLink>
                        </li>

                        {/* Usuarios */}
                        <li
                            className={`mt-1 mb-1 text-[14px] font-semibold text-[#848484]`}
                        >
                            Usuarios
                        </li>

                        <li>
                            <NavLink href={route("aprendiz")}>
                                <div
                                    onClick={() => {
                                        setContent("Dependencia");
                                    }}
                                    className={`flex items-center gap-2 text-sm font-medium text-[#010515] hover:underline ${
                                        url === "/users/aprendiz"
                                            ? "underline"
                                            : ""
                                    }`}
                                >
                                    <AcademicCapIcon
                                        className={`w-5 h-5 text-[#848484]`}
                                    />
                                    Aprendices
                                </div>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink href={route("instructor")}>
                                <div
                                    onClick={() => {
                                        setContent("Instructor");
                                    }}
                                    className={`flex items-center gap-2 text-sm font-medium text-[#010515] hover:underline ${
                                        url === "/users/instructor"
                                            ? "underline"
                                            : ""
                                    }`}
                                >
                                    <ListBulletIcon
                                        className={`w-5 h-5 text-[#848484]`}
                                    />
                                    Instructores
                                </div>
                            </NavLink>
                        </li>

                        {/* Solicitudes */}
                        <li
                            className={`mt-1 mb-1 text-[14px] font-semibold text-[#848484]`}
                        >
                            Solicitudes
                        </li>

                        <li>
                            <NavLink href={route("notifications.index")}>
                                <div
                                    className={`flex items-center gap-2 text-sm font-medium text-[#010515] hover:underline ${
                                        url === "/notifications"
                                            ? "underline"
                                            : ""
                                    }`}
                                >
                                    <UserCircleIcon
                                        className={`w-5 h-5 text-[#848484]`}
                                    />
                                    Aprendices
                                </div>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink href={route("notifications.index")}>
                                <div
                                    className={`flex items-center gap-2 text-sm font-medium text-[#010515] hover:underline ${
                                        url === "/notifications"
                                            ? "underline"
                                            : ""
                                    }`}
                                >
                                    <UserCircleIcon
                                        className={`w-5 h-5 text-[#848484]`}
                                    />
                                    Instructores
                                </div>
                            </NavLink>
                        </li>

                        {/* Gestión Documental */}
                        <li
                            className={`mt-1 mb-1 text-[14px] font-semibold text-[#848484]`}
                        >
                            Gestión Documental
                        </li>

                        <li>
                            <div
                                className={`flex items-center gap-2 text-sm font-medium text-[#010515]`}
                            >
                                <UserCircleIcon
                                    className={`w-5 h-5 text-[#848484]`}
                                />
                                Dependencias
                            </div>
                        </li>

                        <li>
                            <div
                                className={`flex items-center gap-2 text-sm font-medium text-[#010515]`}
                            >
                                <UserCircleIcon
                                    className={`w-5 h-5 text-[#848484]`}
                                />
                                Series y Subseries
                            </div>
                        </li>

                        <li>
                            <div
                                className={`flex items-center gap-2 text-sm font-medium text-[#010515]`}
                            >
                                <UserCircleIcon
                                    className={`w-5 h-5 text-[#848484]`}
                                />
                                Secciones y Subsecciones
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default HamburguerMenu;

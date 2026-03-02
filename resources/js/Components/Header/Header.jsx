import { Link, router, usePage } from "@inertiajs/react";
import NotificationDropDown from "../Notifications/NotificationDropDown";
import { useState } from "react";
import {
    UserIcon,
    UserCircleIcon,
    AcademicCapIcon,
    ListBulletIcon,
    Cog6ToothIcon,
    ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";

export default function Header() {
    const { url, props } = usePage();
    const user = props?.auth?.user;
    const rol = user?.roles?.[0]?.name;

    const shouldShowHamburger = !["/", "/archive", "/explorer"].includes(url);
    const [loadingPhoto, setLoadingPhoto] = useState(true);

    const logout = (e) => {
        e.preventDefault();
        let toastId;

        router.post(
            "/logout",
            {},
            {
                onStart: () => {
                    toastId = toast.loading("Cerrando sesión...");
                },
                onSuccess: () => {
                    toast.success("Sesión cerrada con éxito");
                },
                onError: () => {
                    toast.error("Error al cerrar sesión");
                },
                onFinish: () => {
                    if (toastId) toast.dismiss(toastId);
                },
            },
        );
    };

    return (
        <header className="bg-white shadow-sm px-4 h-14 flex justify-between items-center fixed top-0 left-0 z-10 w-screen">
            {/* HAMBURGER */}
            {shouldShowHamburger && (
                <div className="dropdown lg:hidden">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost btn-circle"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="h-5 w-5 stroke-current"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </div>

                    <ul className="menu dropdown-content bg-white rounded-box mt-3 w-72 p-3 shadow z-50">
                        <li>
                            <Link href={route("profile.edit")}>
                                <div className="flex gap-2">
                                    <UserCircleIcon className="w-5 h-5" />
                                    Perfil
                                </div>
                            </Link>
                        </li>

                        {rol === "Admin" && (
                            <>
                                <li className="mt-3 text-xs font-semibold">
                                    Usuarios
                                </li>

                                <li>
                                    <Link href={route("aprendiz")}>
                                        <AcademicCapIcon className="w-5 h-5" />
                                        Aprendices
                                    </Link>
                                </li>

                                <li>
                                    <Link href={route("instructor")}>
                                        <ListBulletIcon className="w-5 h-5" />
                                        Instructores
                                    </Link>
                                </li>

                                <li>
                                    <Link href={route("sheets")}>
                                        <UserCircleIcon className="w-5 h-5" />
                                        Fichas
                                    </Link>
                                </li>
                            </>
                        )}

                        <li className="mt-3 text-xs font-semibold">
                            Gestión Documental
                        </li>

                        <li>
                            <Link href={route("dependencies")}>
                                <UserCircleIcon className="w-5 h-5" />
                                Dependencias
                            </Link>
                        </li>
                    </ul>
                </div>
            )}

            {/* LOGO */}
            <Link href={route("inbox")}>
                <img src="/gedocs-logo.svg" className="h-8" />
            </Link>

            {/* RIGHT SIDE */}
            <div className="flex gap-4 items-center">
                {rol === "Admin" ||
                    (rol === "Instructor" && <NotificationDropDown />)}

                {/* USER MENU */}
                <div className="dropdown dropdown-end">
                    <div
                        tabIndex={0}
                        role="button"
                        className="cursor-pointer rounded-full bg-gray-200 w-10 h-10 overflow-hidden"
                    >
                        {user?.profile_photo ? (
                            <img
                                src={user.profile_photo}
                                onLoad={() => setLoadingPhoto(false)}
                                onError={() => setLoadingPhoto(false)}
                                className={`w-full h-full object-cover ${
                                    loadingPhoto ? "opacity-0" : "opacity-100"
                                }`}
                            />
                        ) : (
                            <UserIcon className="w-full h-full p-2 text-gray-400" />
                        )}
                    </div>

                    <ul className="menu dropdown-content bg-base-100 rounded-box mt-3 p-2 shadow z-50">
                        <li className="px-3 py-2">
                            <p>{user?.name}</p>
                            <p className="text-xs">{rol}</p>
                            <p className="text-xs text-gray-500">
                                {user?.email}
                            </p>
                        </li>

                        <li>
                            <Link href={route("profile.edit")}>
                                <Cog6ToothIcon className="w-5 h-5" />
                                Configuración
                            </Link>
                        </li>

                        <li>
                            <button onClick={logout}>
                                <ArrowLeftEndOnRectangleIcon className="w-5 h-5" />
                                Cerrar sesión
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
}

import { Link, router, usePage } from "@inertiajs/react";
import {
    UserCircleIcon,
    AcademicCapIcon,
    ListBulletIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import NotificationDropDown from "../Notifications/NotificationDropDown";
import { NotificationsContext } from "@/context/Notifications/NotificationsContext";
import { useContext, useEffect } from "react";

export default function ProfileHeader({
    setOpenObject,
    openObject,
    setOpenObject1,
    openObject1,
}) {
    const { props } = usePage();
    const user = props.auth.user;
    const showEditProfile = route().current("profile.edit");

    const { fetchNotifications } = useContext(NotificationsContext);

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <header className="bg-white shadow-sm px-4 h-14 flex justify-between items-center fixed top-0 left-0 z-50 w-screen">
            {/* LEFT SIDE */}
            <div className="flex items-center gap-3">
                {/* MENU HAMBURGUESA - SOLO MOVIL */}
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
                            className="inline-block h-5 w-5 stroke-current"
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
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-56 p-2 shadow"
                    >
                        {/* PERFIL */}
                        <li>
                            <Link href={route("profile.edit")}>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <UserCircleIcon className="w-5 h-5 text-[#848484]" />
                                    Información de Perfil
                                </div>
                            </Link>
                        </li>

                        {/* USUARIOS */}
                        <li className="mt-2 mb-1 text-[14px] font-semibold text-[#848484]">
                            Usuarios
                        </li>

                        <li>
                            <Link href={route("aprendiz")}>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <AcademicCapIcon className="w-5 h-5 text-[#848484]" />
                                    Aprendices
                                </div>
                            </Link>
                        </li>

                        <li>
                            <Link href={route("instructor")}>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <ListBulletIcon className="w-5 h-5 text-[#848484]" />
                                    Instructores
                                </div>
                            </Link>
                        </li>

                        <li>
                            <Link href={route("sheets")}>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <UserCircleIcon className="w-5 h-5 text-[#848484]" />
                                    Fichas
                                </div>
                            </Link>
                        </li>

                        {/* EDITAR PERFIL */}
                        {showEditProfile && (
                            <>
                                <li className="mt-3 mb-1 text-[14px] font-semibold text-[#848484]">
                                    Editar Perfil
                                </li>

                                <li
                                    onClick={() =>
                                        setOpenObject((prev) => !prev)
                                    }
                                >
                                    <div className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                        <PencilSquareIcon className="w-5 h-5 text-[#848484]" />
                                        Cambiar Contraseña
                                    </div>
                                </li>

                                <li
                                    onClick={() =>
                                        setOpenObject1((prev) => !prev)
                                    }
                                >
                                    <div className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                        <TrashIcon className="w-5 h-5 text-[#848484]" />
                                        Eliminar Cuenta
                                    </div>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
            <div className="flex flex-1 justify-center lg:justify-start">
                <Link href="/">
                    <img
                        src="/gedocs-logo.svg"
                        alt="gedocs logo"
                        className="h-8"
                    />
                </Link>
            </div>

            <div className="flex gap-4 items-center h-full">
                <NotificationDropDown />

                <div className="dropdown dropdown-end">
                    <div
                        tabIndex={0}
                        role="button"
                        className="cursor-pointer rounded-md gap-3 flex items-center"
                    >
                        <img
                            className="w-10 rounded-full"
                            alt="profile pic"
                            src="/images/girl-pic.jpg"
                        />
                    </div>

                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-max p-2 shadow overflow-hidden"
                    >
                        <div className="border-b border-gray-500 p-2 mb-2">
                            <div className="flex justify-between items-center mb-2 gap-8">
                                <p>{user?.name}</p>
                                <p className="text-gray-500 text-xs">
                                    {user?.role}
                                </p>
                            </div>

                            <p className="text-xs text-gray-500">
                                {user?.email}
                            </p>
                        </div>

                        <li>
                            <Link href={route("profile.edit")}>
                                Configuración
                            </Link>
                        </li>

                        <li>
                            <button onClick={() => router.post("/logout")}>
                                Cerrar sesión
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
}

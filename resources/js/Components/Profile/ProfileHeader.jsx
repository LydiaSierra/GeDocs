import {Link, router, usePage} from "@inertiajs/react";
import {
    UserCircleIcon,
    AcademicCapIcon,
    ListBulletIcon,
    PencilSquareIcon,
    TrashIcon, UserIcon,
} from "@heroicons/react/24/outline";
import NotificationDropDown from "../Notifications/NotificationDropDown";
import { NotificationsContext } from "@/context/Notifications/NotificationsContext";
import { useContext, useEffect, useState } from "react";

export default function ProfileHeader({ setOpenObject, setOpenObject1 }) {
    const { props, url } = usePage();
    const user = props.auth.user;
    const rol = user.roles[0].name;

    const showEditProfile = route().current("profile.edit");
    const { fetchNotifications } = useContext(NotificationsContext);
    const [loadingPhoto, setLoadingPhoto] = useState(true)

    useEffect(() => {
        fetchNotifications();
        if(user.profile_photo){
            setLoadingPhoto(true);
        }else{
            setLoadingPhoto(false)
        }
    }, [fetchNotifications]);

    const itemClass = (active) =>
        `flex items-center gap-2 text-sm font-medium ${active ? "underline" : "hover:underline"
        }`;

    return (
        <header className="bg-white shadow-sm px-4 h-14 flex justify-between items-center fixed top-0 left-0 z-50 w-screen">

            <div className="flex items-center gap-3">
                {/* HAMBURGUESA  */}
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

                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-white rounded-box mt-3 w-64 p-3 shadow z-50"
                    >

                        <li>
                            <Link href={route("profile.edit")}>
                                <div className={itemClass(url === "/profile")}>
                                    <UserCircleIcon className="w-5 h-5 text-[#848484]" />
                                    Información de Perfil
                                </div>
                            </Link>
                        </li>


                        {rol === "Admin" && (
                            <>
                                <li className="mt-3 text-xs font-semibold text-[#848484]">
                                    Usuarios
                                </li>

                                <li>
                                    <Link href={route("aprendiz")}>
                                        <div
                                            className={itemClass(
                                                url === "/users/aprendiz"
                                            )}
                                        >
                                            <AcademicCapIcon className="w-5 h-5 text-[#848484]" />
                                            Aprendices
                                        </div>
                                    </Link>
                                </li>

                                <li>
                                    <Link href={route("instructor")}>
                                        <div
                                            className={itemClass(
                                                url === "/users/instructor"
                                            )}
                                        >
                                            <ListBulletIcon className="w-5 h-5 text-[#848484]" />
                                            Instructores
                                        </div>
                                    </Link>
                                </li>

                                <li>
                                    <Link href={route("sheets")}>
                                        <div
                                            className={itemClass(
                                                url === "/sheets"
                                            )}
                                        >
                                            <UserCircleIcon className="w-5 h-5 text-[#848484]" />
                                            Fichas
                                        </div>
                                    </Link>
                                </li>
                            </>
                        )}

                        {/* SOLICITUDES */}
                        <li className="mt-3 text-xs font-semibold text-[#848484]">
                            Solicitudes
                        </li>

                        {rol !== "Dependencia" && (
                            <li>
                                <Link href={route("notifications.index")}>
                                    <div
                                        className={itemClass(
                                            url === "/notifications"
                                        )}
                                    >
                                        <UserCircleIcon className="w-5 h-5 text-[#848484]" />
                                        Aprendices
                                    </div>
                                </Link>
                            </li>
                        )}

                        {rol === "Admin" && (
                            <li>
                                <Link href={route("notifications.index")}>
                                    <div className={itemClass(false)}>
                                        <UserCircleIcon className="w-5 h-5 text-[#848484]" />
                                        Instructores
                                    </div>
                                </Link>
                            </li>
                        )}

                        {/* GESTIÓN DOCUMENTAL */}
                        <li className="mt-3 text-xs font-semibold text-[#848484]">
                            Gestión Documental
                        </li>

                        <li>
                            <Link href={route("dependencies")}>
                                <div
                                    className={itemClass(
                                        url === "/dependencies"
                                    )}
                                >
                                    <UserCircleIcon className="w-5 h-5 text-[#848484]" />
                                    Dependencias
                                </div>
                            </Link>
                        </li>

                        <li>
                            <div className={itemClass(false)}>
                                <UserCircleIcon className="w-5 h-5 text-[#848484]" />
                                Series y Subseries
                            </div>
                        </li>

                        <li>
                            <div className={itemClass(false)}>
                                <UserCircleIcon className="w-5 h-5 text-[#848484]" />
                                Secciones y Subsecciones
                            </div>
                        </li>

                        {/* EDITAR PERFIL */}
                        {showEditProfile && (
                            <>
                                <li className="mt-3 text-xs font-semibold text-[#848484]">
                                    Editar Perfil
                                </li>

                                <li onClick={() => setOpenObject(true)}>
                                    <div className="flex items-center gap-2 text-sm font-medium cursor-pointer hover:underline">
                                        <PencilSquareIcon className="w-5 h-5 text-[#848484]" />
                                        Cambiar Contraseña
                                    </div>
                                </li>

                                {rol === "Admin" && (
                                    <li onClick={() => setOpenObject1(true)}>
                                        <div className="flex items-center gap-2 text-sm font-medium cursor-pointer hover:underline">
                                            <TrashIcon className="w-5 h-5 text-[#848484]" />
                                            Eliminar Cuenta
                                        </div>
                                    </li>
                                )}
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
                        className="cursor-pointer gap-3 flex items-center rounded-full bg-gray-200 "
                    >
                        {loadingPhoto && (
                            <div className="skeleton h-10 w-10 rounded-full  absolute inset-0" />
                        )}

                        {user.profile_photo ? (
                            <div className="rounded-full w-10 h-10 bg-gray-200 flex items-center justify-center">
                                <img
                                    src={user.profile_photo}
                                    className={` ${loadingPhoto ? "opacity-0 w-10 h-10" : "opacity-100  object-cover w-full h-full rounded-full"
                                    }`}
                                    onLoad={() => setLoadingPhoto(false)}
                                    onError={() => setLoadingPhoto(false)}
                                />
                            </div>
                        ) : (

                            <UserIcon className="h-10 w-10 text-gray-400 rounded-full p-1" />
                        )}
                    </div>

                    <ul
                        tabIndex={0}
                        className="menu w-xl max-w-sm  dropdown-content bg-base-100 rounded-box z-50 mt-3 p-2 shadow overflow-hidden"
                    >
                        <div className="border-b border-gray-500 p-2 mb-2 flex items-center justify-start gap-3 ">

                            {loadingPhoto && (
                                <div className="skeleton h-10 w-10 rounded-full  absolute inset-0" />
                            )}

                            {user.profile_photo ? (
                                <div className="rounded-full w-14 h-14 bg-gray-200 flex items-center justify-center ">
                                    <img
                                        src={user.profile_photo}
                                        className={` ${loadingPhoto ? "opacity-0 w-14 h-14 " : "opacity-100  object-cover w-full h-full rounded-full"
                                        }`}
                                        onLoad={() => setLoadingPhoto(false)}
                                        onError={() => setLoadingPhoto(false)}
                                    />
                                </div>
                            ) : (
                                <UserIcon className="w-10 text-gray-400 rounded-full p-1 bg-gray-200" />
                            )}
                            <div className="flex flex-col flex-1">

                                <div className="mb-2 gap-8 flex justify-between item-center">
                                    <p>{user?.name}</p>
                                    <p>
                                        {rol}
                                    </p>
                                </div>

                                <p className="text-xs text-gray-500">
                                    {user?.email}
                                </p>
                            </div>

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

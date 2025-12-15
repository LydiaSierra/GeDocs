import { Link, router, usePage } from "@inertiajs/react";

import NotificationDropDown from "../Notifications/NotificationDropDown";
import api from "@/lib/axios.js";
import HamburguerMenu from "../HamburguerMenu/HamburguerMenu";
import { ArchiveDataContext } from "@/context/ArchiveExplorer/ArchiveDataContext";
import { useContext, useEffect, useState } from "react";
import { NotificationsContext } from "@/context/Notifications/NotificationsContext";

export default function Header() {
    const { url } = usePage();
    const { props } = usePage();
    
    
    const user = props.auth.user;
    const rol = user.roles[0].name;

    const MobileMenu =
        url === "/users/aprendiz" ||
        url === "/users/instructor" ||
        url === "/notifications";

    const { fetchNotifications } = useContext(NotificationsContext);
    const { setcurrentFolder } = useContext(ArchiveDataContext);
    const [loadingPhoto, setLoadingPhoto] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <header className="bg-white shadow-sm px-4 h-14 flex justify-between items-center fixed top-0 left-0 z-50 w-screen">
            {MobileMenu && <HamburguerMenu url={url} />}
            <div>
                <a href="/">
                    <img
                        src="/gedocs-logo.svg"
                        alt="gedocs logo"
                        className="h-8 block"
                    />
                </a>
            </div>

            <div className="flex gap-4 items-center h-full">
                <NotificationDropDown />


                <div className="dropdown dropdown-end">
                    <div
                        tabIndex={0}
                        role="button"
                        className="cursor-pointer rounded-md gap-3 flex items-center"
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
                            <UserIcon className="h-40 w-40 text-gray-400 rounded-full" />
                        )}
                    </div>

                    <ul
                        tabIndex={0}
                        className="menu w-xl max-w-sm  dropdown-content bg-base-100 rounded-box z-50 mt-3 p-2 shadow overflow-hidden"
                    >
                        <div className="border-b border-gray-500 p-2 mb-2 flex items-center justify-start gap-3">

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
                                <UserIcon className="h-40 w-40 text-gray-400 rounded-full" />
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

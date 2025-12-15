import { Link, router, usePage } from "@inertiajs/react";

import NotificationDropDown from "../Notifications/NotificationDropDown";
import api from "@/lib/axios.js";
import HamburguerMenu from "../HamburguerMenu/HamburguerMenu";
import { ArchiveDataContext } from "@/context/ArchiveExplorer/ArchiveDataContext";
import { useContext, useEffect } from "react";
import { NotificationsContext } from "@/context/Notifications/NotificationsContext";

export default function Header() {
    const { url } = usePage();
    const { props } = usePage();

    const user = props.auth.user;

    const MobileMenu =
        url === "/users/aprendiz" ||
        url === "/users/instructor" ||
        url === "/notifications";

    const { fetchNotifications } = useContext(NotificationsContext);
    const { setcurrentFolder } = useContext(ArchiveDataContext);

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
                        <div className={"border-b border-gray-500 p-2  mb-2"}>
                            <div
                                className={
                                    "flex justify-between items-center mb-2 gap-8"
                                }
                            >
                                <p>{user?.name}</p>
                                <p className={"text-gray-500 text-xs"}>
                                    {user?.role}
                                </p>
                            </div>
                            <div>
                                <p className={"text-xs text-gray-500"}>
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
                            <button
                                onClick={() => {
                                    localStorage.removeItem("folder_id");
                                    setcurrentFolder(null);
                                    router.post("/logout");
                                }}
                            >
                                Cerrar sesión
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
}

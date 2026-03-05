import { BellIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { useContext, useEffect, useMemo } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { NotificationsContext } from "@/context/Notifications/NotificationsContext.jsx";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const NotificationDropDown = () => {
    const {
        notifications,
        markAsReadNotification,
        notificationSeleted,
        setNotificationSeleted,
        fetchNotifications,
    } = useContext(NotificationsContext);

    const { auth } = usePage().props;
    const rol = auth.user.roles[0].name;

    // Filtrar notificaciones según rol del usuario autenticado
    const roleFilteredNotifications = useMemo(() => {
        return notifications.filter((item) => {
            const notifRole = item?.data?.user?.roles?.[0]?.name || "";
            if (rol === "Instructor") return notifRole === "Aprendiz";
            if (rol === "Admin") return notifRole === "Instructor";
            return false;
        });
    }, [notifications, rol]);

    const unreadNotifications = roleFilteredNotifications.filter(
        (item) => item.read_at === null
    );

    const hasUnreadNotifications = unreadNotifications.length > 0;


    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <>
            <div className="dropdown dropdown-end">
                <div
                    tabIndex={0}
                    role="button"
                    className="self-center bg-none cursor-pointer relative"
                >
                    <BellIcon
                        className="text-[#848484] 
                    w-5 h-5 md:w-8 md:h-8 sm:w-7 sm:h-7 bg-none cursor-pointer rounded-md fill-none hover:bg-gray-300"
                    />

                    {hasUnreadNotifications && (
                        <PlusCircleIcon
                            className="md:w-3.8 w-3.5 md:h-3.8 h-3.5 fill-[#3CACBB] text-[#3CACBB]
                   border-none absolute md:top-4 -top-1 -right-0.5"
                        />
                    )}
                </div>

                <ul
                    className="dropdown-content bg-base-100 rounded-box z-1 p-2 shadow-sm w-max overflow-auto"
                    tabIndex="-1"
                >
                    <li className="flex flex-col w-max  gap-8 hover:bg-none">
                        <div className="text-center font-bold h-auto border-b w-full border-gray-300 rounded-none p-3">
                            <h2 className="text-lg text-black font-normal">
                                Solicitudes de Acceso
                            </h2>
                        </div>

                        {unreadNotifications.length > 0 ? (
                            <div className="w-full h-auto">
                                {unreadNotifications
                                    .map((item) => (
                                        <article
                                            key={item.id}
                                            className="flex flex-row py-2 w-full gap-2 h-auto border-y border-x-none boder-[#DBDBDB] 
                                        relative hover:bg-accent cursor-pointer transition rounded-md"
                                            onClick={() => {
                                                if (
                                                    item.id !==
                                                        notificationSeleted &&
                                                    !item.read_at
                                                ) {
                                                    markAsReadNotification(
                                                        item.id,
                                                    );
                                                }
                                                setNotificationSeleted(
                                                    !item.id ===
                                                        notificationSeleted
                                                        ? null
                                                        : item.id,
                                                );
                                                router.visit(`/notifications`);
                                            }}
                                        >
                                            <UserCircleIcon className="md:w-13 md:h-13 w-12 h-12 self-center text-[#404142]" />

                                            <div className="w-[80%] h-full flex flex-col items-start gap-1">
                                                <h1 className="text-2xs md:text-lg font-semibold">
                                                    Nuevo{" "}
                                                    {item.data.user.roles[0]
                                                        ?.name || "Usuario"}
                                                </h1>
                                                <p className="text-xs md:text-sm font-medium">
                                                    Solicitud de Acceso:
                                                </p>
                                                <p className="text-xs md:text-sm font-medium">{`${item.data.user.name} solicita un nuevo acceso con...`}</p>
                                            </div>

                                            <div className="w-[10%] h-full flex justify-end items-start ">
                                                <p className=" text-[#404142] font-medium text-xs absolute md:top-5 top-[15%] right-3">
                                                    {new Date(
                                                        item.created_at,
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>

                                            <PlusCircleIcon
                                                className="md:w-4.5 w-3.5 md:h-4.5 h-3.5 fill-[#3CACBB] text-[#3CACBB] 
                                        border-none absolute md:-top-2.5 -top-2 right-0 "
                                            />
                                        </article>
                                    ))}
                            </div>
                        ) : (
                            <p className="w-full text-center text-xs text-[#848484]">
                                No hay solicitudes pendientes sin leer
                            </p>
                        )}
                        <Link
                            className="w-full flex justify-center"
                            href={route("notifications.index")}
                        >
                            <button
                                className="btn p-2 rounded-md border border-gray-300 w-full text-center transition"
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

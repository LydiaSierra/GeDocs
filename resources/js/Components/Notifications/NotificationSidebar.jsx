import React, { useContext, useEffect, useMemo, useState } from "react";
import { NotificationsContext } from "@/context/Notifications/NotificationsContext.jsx";
import {
    PlusCircleIcon,
    FunnelIcon,
    ArrowPathIcon,
} from "@heroicons/react/24/solid";
import NotificationsCard from "@/Components/Notifications/NotificationsCard.jsx";
import EmptyState from "../EmptyState";

const NotificationSidebar = ({ url }) => {
    const {
        notifications,
        markAsReadNotification,
        loading,
        notificationSeleted,
        setNotificationSeleted,
        fetchNotifications,
    } = useContext(NotificationsContext);

    const [openDropdown, setOpenDropdown] = useState(false);
    const [FilterText, setFilterText] = useState("");
    const [filterSelected, setFilterSelected] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);

    useEffect(() => {
        setLoadingSearch(true);
        if (filterSelected === "Instructores") {
            setFilterText("Instructores");
            setIsSearching(true);
        } else if (filterSelected === "Aprendices") {
            setFilterText("Aprendices");
            setIsSearching(true);
        } else {
            setFilterText("");
            setIsSearching(false);
        }
        const timer = setTimeout(() => {
            setLoadingSearch(false);
        }, 0);

        return () => clearTimeout(timer);
    }, [filterSelected]);

    const filteredNotifications = useMemo(() => {
        if (!isSearching || !filterSelected) {
            return notifications;
        }

        const normalizedFilter = filterSelected.toLowerCase();

        return notifications.filter((item) => {
            const role = (item?.data?.role || "").toLowerCase();
            if (normalizedFilter === "instructores") {
                return role.includes("instructor");
            }
            if (normalizedFilter === "aprendices") {
                return role.includes("aprendiz");
            }
            return true;
        });
    }, [isSearching, filterSelected, notifications]);

    if (loading) {
        return (
            <div className="w-auto h-auto flex flex-col absolute top-1/2 md:left-[55%] left-[40%] items-center justify-center z-100">
                <ArrowPathIcon className="size-8 animate-spin" />
                cargando.....
            </div>
        );
    }

    if (loadingSearch) {
        return (
            <div className="w-auto h-auto flex flex-col absolute top-1/2 md:left-[55%] left-[40%] items-center justify-center z-100">
                <ArrowPathIcon className="size-8 animate-spin" />
                cargando.....
            </div>
        );
    }

    return (
        <div
            className={`${notificationSeleted ? "grid-cols-3 grid gap-2" : "flex flex-col gap-2"} mt-2 w-full h-full`}
        >
            <div className={`col-span-1 h-max-content ${notificationSeleted ? "hidden md:block" : ""}`}>
                <div className="flex justify-between items-center flex-wrap gap-4 pr-6">
                    <div className="flex flex-wrap items-center gap-5 w-auto">
                        <h1 className="font-bold text-2xl text-black">
                            Notificaciones de Acceso
                        </h1>

                        <div
                            className={`relative p-2 rounded-md shrink-0 cursor-pointer bg-[#E8E8E8]
                        ${openDropdown ? "bg-[#E8E8E8]" : ""} `}
                            onClick={() => {
                                if (openDropdown === false) {
                                    setOpenDropdown(true);
                                } else {
                                    setOpenDropdown(false);
                                }
                            }}
                        >
                            <div className="flex flex-row justify-center items-center gap-3">
                                <FunnelIcon className="size-5 text-[#404142] " />
                                {FilterText}
                            </div>

                            {openDropdown && (
                                <div className="absolute left-0 top-full w-40 h-auto bg-white shadow-lg rounded-md border z-20">
                                    <ul className="py-2 text-sm text-neutral text-start">
                                        <li
                                            className="px-4 py-2 hover:bg-accent cursor-pointer"
                                            onClick={() => {
                                                setOpenDropdown(false);
                                                setFilterSelected("Aprendices");
                                            }}
                                        >
                                            Aprendices
                                        </li>
                                        <li
                                            className="px-4 py-2 hover:bg-accent cursor-pointer"
                                            onClick={() => {
                                                setOpenDropdown(false);
                                                setFilterSelected(
                                                    "Instructores",
                                                );
                                            }}
                                        >
                                            Instructores
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        {isSearching ? (
                            <button
                                className="w-auto px-3 h-auto py-2 rounded-[7px] bg-primary text-[16px] cursor-pointer text-white border-none font-semibold text-center hover:border-solid border-2 hover:border-primary hover:bg-white hover:text-primary"
                                onClick={() => {
                                    setFilterSelected("");
                                }}
                            >
                                Ver Todos
                            </button>
                        ) : null}
                    </div>

                    <h1
                        className="cursor-pointer bg-base-content px-3 max-w-content max-h-content rounded-md hover:scale-105 transition-all flex items-center gap-1 text-sm py-1 text-white"
                        onClick={() => {
                            fetchNotifications();
                        }}
                    >
                        Refrescar Notificaciones
                    </h1>
                </div>

                {filteredNotifications.length > 0 ? (
                    <ul className="flex flex-col overflow-y-scroll gap-3 pr-2 mt-1 rounded-lg h-auto">
                        {/* condicionales para estilos dependiendo el estado de la notificacion */}
                        {filteredNotifications.map((item) => {
                            const isSelected = item.id === notificationSeleted;
                            const isRead = item.read_at;
                            const isActive =
                                item.data?.user?.status === "active";
                            const isRejected =
                                item.data?.user?.status === "rejected";
                            return (
                                <li
                                    key={item.id}
                                    onClick={() => {
                                        if (!isSelected && !isRead) {
                                            markAsReadNotification(item.id);
                                        }
                                        setNotificationSeleted(
                                            isSelected ? null : item.id,
                                        );
                                    }}
                                    className={`flex flex-row w-full h-auto border-y border-x-none cursor-pointer relative p-2 mt-1.5 rounded-xl hover:bg-[#6CF1F5]
                                ${isRead ? "text-[#848484]" : "text-black font-bold "}
                                ${isSelected ? "bg-[#6CF1F5]" : "bg-white"} ${isActive ? "text-green-800" : ""}`}
                                >
                                    <div
                                        className={`"w-full flex flex-col items-start gap-1" }`}
                                    >
                                        <h1 className={`text-[17px]`}>
                                            Nuevo{" "}
                                            {`${item?.data?.role || "instructor"}`}
                                        </h1>

                                        {/* texto de la notificacion */}
                                        <p className="text-[15px]">
                                            {" "}
                                            Solicitud de acceso:{" "}
                                        </p>
                                        <p className="text-[15px]">
                                            {" "}
                                            {`${item.data.user.name} desea solicitar un nuevo acceso con
                                el rol ${item?.data?.role || "instructor"} en el sistema`}{" "}
                                        </p>
                                    </div>

                                    <p
                                        className={`absolute top-3 right-3 text-[12px]`}
                                    >
                                        {new Date(
                                            item.created_at,
                                        ).toLocaleDateString()}
                                    </p>

                                    <p className={`hidden md:block w-fit h-fit absolute right-3 bottom-3 ${isRejected ? "text-red-400" : isActive ? "text-green-800" : "text-gray-500"}`}>
                                        {isRejected
                                            ? "Rechazada"
                                            : isActive
                                              ? "Aceptada"
                                              : "Pendiente"}
                                    </p>

                                    <PlusCircleIcon
                                        className={`${item.read_at ? "hidden" : "w-3 h-3 text-[#3CACBB] fill-[#3CACBB] rounded-[50%] bg-[#3CACBB] absolute -top-1.5 right-0"}`}
                                    />
                                    {isRead && !isActive && !isSelected && (
                                        <span
                                            className={` w-3 h-3 rounded-[50%] ${isRejected ? "bg-red-400" : !isActive ? "" : ""} absolute -top-1.5 right-0`}
                                        ></span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="absolute w-auto h-auto top-1/2 md:left-1/2 left-[34%]  text-ray-500 flex items-center justify-center z-5">
                        <p>No hay notificaciones</p>
                    </div>
                )}
            </div>

            {notificationSeleted && (
                <div className="col-span-3 md:col-span-2">
                    <NotificationsCard />
                </div>
            )}
        </div>
    );
};

export default NotificationSidebar;

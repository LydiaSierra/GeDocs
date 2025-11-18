import { NotificationsContext } from "@/context/Notifications/NotificationsContext";
import React, { useContext } from "react";


const NotificationsCard = ({item}) => {
    return (
        <>
            <div
                 className={`${item.read_at ? "text-gray-500" : "text-black font-bold"} p-2 rounded-lg my-2 shadow cursor-pointer hover:bg-gray-100`}
            >
                <h1>
                    {item.data.title || item.data.message}
                </h1>
                <p className={"text-sm line-clamp-1"}>
                    {item.data.description}
                </p>
                <p className={"text-xs text-gray-500 font-medium line-clamp-1 ml-1"}>
                    {item.data.message}
                </p>
            </div>
        </>
    )
}


export default NotificationsCard;

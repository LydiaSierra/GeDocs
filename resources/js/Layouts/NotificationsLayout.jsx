import Header from "@/Components/Header/Header.jsx";
import Sidebar from "@/Components/Sidebar/Sidebar.jsx";
import React, {useContext} from "react";
import {NotificationsContext} from "@/context/Notifications/NotificationsContext.jsx";
import NotificationSidebar from "@/Components/Notifications/NotificationSidebar.jsx";
import NotficationMenu from "../Components/Notifications/NotficationMenu"

const NotificationsLayout = ({children}) => {
    return (
        <>
            <div className='bg-gray-100 flex flex-col h-screen w-screen justify-center'>
                <Header/>
                <div className='flex h-full pl-3 pb-3 pt-12 rounded-lg'>
                    <NotficationMenu/>

                    <div className='pt-1.5 pb-2 w-full h-full '>
                        <div className={"p-2 w-full h-full flex flex-row"}>
                            {children}
                        </div>

                    </div>
                </div>

            </div>
        </>
    )
}

export default NotificationsLayout;

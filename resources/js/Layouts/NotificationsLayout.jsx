import Header from "@/Components/Header/Header.jsx";
import Sidebar from "@/Components/Sidebar/Sidebar.jsx";
import React, {useContext} from "react";
import {NotificationsContext} from "@/context/Notifications/NotificationsContext.jsx";
import NotificationSidebar from "@/Components/Notifications/NotificationSidebar.jsx";

const NotificationsLayout = ({children}) => {
    return (
        <>
            <div className='bg-gray-100'>
                <Header/>
                <div className='flex h-screen'>
                    <Sidebar/>

                    <div className='pt-16 pb-2 w-full h-full flex'>

                        <NotificationSidebar/>


                        <div className={"p-2"}>
                            {children}
                        </div>

                    </div>
                </div>

            </div>
        </>
    )
}

export default NotificationsLayout;

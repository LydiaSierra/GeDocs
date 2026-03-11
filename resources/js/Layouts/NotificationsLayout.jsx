import Header from "@/Components/Header/Header.jsx";
import Sidebar from "@/Components/Sidebar/Sidebar.jsx";
import React, {useContext, useEffect} from "react";
import SettingsBar from "../Components/SettingsBar/SettingsBar"

const NotificationsLayout = ({children}) => {
    return (
        <>
            <div className='bg-gray-100 flex flex-col h-screen w-screen justify-center overflow-hidden'>
                <Header/>
                <div className='flex flex-1 pl-3 pb-3 pt-12 rounded-lg h-0'>
                    <SettingsBar/>

                    <div className='pt-1.5 pb-2 w-full h-full'>
                        <div className={"p-2 w-full h-full flex flex-row gap-5"}>
                            {children}
                        </div>

                    </div>
                </div>

            </div>
        </>
    )
}

export default NotificationsLayout;

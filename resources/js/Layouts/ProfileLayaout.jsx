import Header from "@/Components/Header/Header.jsx";
import Sidebar from "@/Components/Sidebar/Sidebar.jsx";
import React from "react";
import ProfileHeader from "@/Components/Profile/ProfileHeader.jsx";
import ProfileMenu from "@/Components/Profile/ProfileMenu.jsx";
import SettingsBar from "@/Components/SettingsBar/SettingsBar";
import ProfileSidebar from "@/Components/Profile/ProfileSidebar";


const ProfileLayaout = ({ children, url }) => {
    return (
        <>
            <div className="bg-gray-100 flex flex-col h-screen w-screen justify-center  ">
                <ProfileHeader />

                <div className="flex h-full pl-3 pb-3 pt-12 rounded-lg gap-10">
                    {/* ProfileMenu oculto en móvil, visible desde md */}
                        <SettingsBar url={url}/>

                    <div className=" pb-2 w-full h-full flex">
                        <ProfileSidebar/>

                        <div className="p-2 w-full h-full flex flex-col gap-5 pr-10">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileLayaout;

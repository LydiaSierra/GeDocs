import Header from "@/Components/Header/Header.jsx";
import Sidebar from "@/Components/Sidebar/Sidebar.jsx";
<<<<<<< Updated upstream:resources/js/Layouts/ProfileLayout.jsx
import React from "react";
import ProfileHeader from '@/Components/Profile/ProfileHeader.jsx';
import ProfileMenu from '@/Components/Profile/ProfileMenu.jsx';
import ProfileSidebar from '@/Components/Profile/ProfileSidebar.jsx';

const ProfileLayout = ({children}) => {
    return (
        <>
            <div className='bg-gray-100'>
                <ProfileHeader/>
                <div className='flex h-screen'>
=======
import React, { useState } from "react";
import ProfileHeader from "@/Components/Profile/ProfileHeader.jsx";
import ProfileMenu from "@/Components/Profile/ProfileMenu.jsx";
import ProfileSidebar from "@/Components/Profile/ProfileSidebar.jsx";

const ProfileLayaout = ({
    children,
    setOpenObject,
    openObject,
    setOpenObject1,
    openObject1,
}) => {
    return (
        <>
            <div className="bg-gray-100">
                <ProfileHeader />

                <div className="flex h-screen">
>>>>>>> Stashed changes:resources/js/Layouts/ProfileLayaout.jsx
                    {/* ProfileMenu oculto en móvil, visible desde md */}
                    <div className="hidden md:flex w-[26%] p-2">
                        <ProfileMenu
                            setOpenObject={setOpenObject}
                            openObject={openObject}
                            setOpenObject1={setOpenObject1}
                            openObject1={openObject1}
                        />
                    </div>
<<<<<<< Updated upstream:resources/js/Layouts/ProfileLayout.jsx
                    <div className='pt-16 pb-2 w-full h-full flex overflow-hidden'>
                            <ProfileSidebar/>
=======

                    <div className="pt-16 pb-2 w-full h-full flex overflow-hidden">
                        <ProfileSidebar />

>>>>>>> Stashed changes:resources/js/Layouts/ProfileLayaout.jsx
                        <div className="p-2 w-full h-full overflow-y-hidden overflow-x-hidden">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileLayout;

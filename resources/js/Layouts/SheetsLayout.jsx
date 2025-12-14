import React from "react";
import ProfileHeader from "@/Components/Profile/ProfileHeader.jsx";
import ProfileMenu from "@/Components/Profile/ProfileMenu.jsx";
import InboxSidebar from "@/Components/InboxSidebar/InboxSidebar";
import SheetsSidebar from "@/Components/Sheets/SheetsSidebar";

const ProfileLayout = ({ children }) => {
    return (
        <>
            <div className="bg-gray-100">
                <ProfileHeader />

                <div className="flex h-screen">
                    <div className="hidden md:flex w-[26%] p-2">
                        <ProfileMenu />
                    </div>

                    <div className="pt-16 pb-2 w-full max-w-[1800px] flex overflow-hidden">
                        <SheetsSidebar />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileLayout;

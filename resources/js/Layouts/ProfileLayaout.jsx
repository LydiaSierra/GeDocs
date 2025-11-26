import Header from "@/Components/Header/Header.jsx";
import Sidebar from "@/Components/Sidebar/Sidebar.jsx";
import React from "react";
import ProfileHeader from '@/Components/Profile/ProfileHeader.jsx'
import ProfileMenu from '@/Components/Profile/ProfileMenu.jsx'
import ProfileSidebar from '@/Components/Profile/ProfileSidebar.jsx'

const ProfileLayaout = ({children}) => {
    return (
        <>
            <div className='bg-gray-100'>
                <ProfileHeader/>

                <div className='flex h-screen'>

                    {/* ProfileMenu oculto en móvil, visible desde md */}
                    <div className="hidden md:flex w-[26%] p-2">
                        <ProfileMenu/>
                    </div>

                    <div className='pt-16 pb-2 w-full h-full flex overflow-hidden'>
                            
                    
                       
                            <ProfileSidebar />
                       

                        <div className="p-2 w-full h-full overflow-y-hidden overflow-x-hidden">
                            {children}
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfileLayaout;

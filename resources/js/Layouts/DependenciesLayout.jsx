import Header from "@/Components/Header/Header.jsx";
import React from "react";
import ProfileMenu from '@/Components/Profile/ProfileMenu.jsx'
import DependenciesSidebar from '@/Components/Dependencies/DependenciesSidebar.jsx'

const ProfileLayaout = ({children}) => {
    return (
        <>
            <div className='bg-gray-100'>
                <Header/>

                <div className='flex h-screen'>

                    {/* ProfileMenu oculto en móvil, visible desde md */}
                    <div className="hidden md:flex w-[26%] p-2">
                        <ProfileMenu/>
                    </div>

                    <div className='pt-16 pb-2 w-full h-full flex overflow-hidden'>
                            
                    
                       
                            <DependenciesSidebar/>
                       

                        

                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfileLayaout;

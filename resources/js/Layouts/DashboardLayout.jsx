import Header from '@/Components/Header/Header'
import Sidebar from '@/Components/Sidebar/Sidebar'
import React from 'react'
import DropdownFolders from "@/Components/ArchiveExplorer/DropdownFolders.jsx";

export const DashboardLayout = ({children}) => {
    return (
        <div className='bg-gray-100'>
            <Header/>
            <div className='flex gap-2 h-screen'>
                <Sidebar/>
                <DropdownFolders/>
                <div className='pt-14 pb-2 w-full h-full'>
                    {children}
                </div>
            </div>

        </div>
    )
}

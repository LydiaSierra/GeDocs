import {ArchiveDataContext} from '@/context/ArchiveExplorer/ArchiveDataContext';
import {ArchiveUIContext} from '@/context/ArchiveExplorer/ArchiveUIContext'
import React, {useContext} from 'react'
import {FolderIcon} from "@heroicons/react/24/solid";
import {ChevronRightIcon} from "@heroicons/react/24/outline";
import {ArrowLeftIcon} from "@heroicons/react/24/solid/index.js";
import Folder from "@/Components/ArchiveExplorer/Folder.jsx";
import {usePage} from "@inertiajs/react";

const DropdownFolders = () => {
    const {showDropFolders} = useContext(ArchiveUIContext);
    const {allFolders, openFolder} = useContext(ArchiveDataContext);
    const url = usePage().url;


    const renderFolders = (parentId = null) => {
        return (allFolders || [])
            .filter((folder) => folder.parent_id === parentId)
            .map((folder) => (
                <div key={folder.id} className="ml-4 border-l border-gray-300 pl-2">
                    <div>
                        <div className={"flex items-center gap-1 w-max hover:bg-gray-100 my-2"}
                             onClick={() => {
                                 openFolder(folder.id, true)
                             }}>
                            <FolderIcon className={"w-4 text-gray-500"}/>
                            <span className={"text-sm "}>{folder.name}</span>
                        </div>
                    </div>
                    {renderFolders(folder.id)}
                </div>
            ));
    };
    return (
        <>
            {url === "/explorer" &&
                <div
                    className={`${showDropFolders ? 'w-full' : 'w-0'}  transition-all origin-left pt-16 pb-2 max-w-[400px] duration-600 h-screen relative`}>
                    <div
                        className={`bg-white  p-2 rounded-lg h-full  ${showDropFolders ? "overflow-auto" : "overflow-hidden"}`}>
                        <p className='border-b py-2 font-medium'>
                            Carpetas
                        </p>
                        {renderFolders()}
                      
                    </div>
                </div>

            }

        </>
    )
}

export default DropdownFolders

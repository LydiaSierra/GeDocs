
import { useContext, useEffect, useState } from "react";
import {
    FolderIcon,
    DocumentIcon,
    ArrowPathIcon,
    ArrowDownTrayIcon,
    EllipsisVerticalIcon,
    InformationCircleIcon, ArrowLeftIcon,
} from "@heroicons/react/24/solid";
import { ArchiveDataContext } from "@/context/ArchiveExplorer/ArchiveDataContext.jsx";
import { ArchiveUIContext } from "@/context/ArchiveExplorer/ArchiveUIContext.jsx";
import { usePage } from "@inertiajs/react";
import Folder from "@/Components/ArchiveExplorer/Folder.jsx";
import { RightClickContext } from "@/context/ArchiveExplorer/RightClickContext.jsx";
import FileExplorer from "./FileExplorer";
import api from "@/lib/axios";


// Main ArchiveExplorer component

export default function ContainerFolders() {
    const {
        folders,
        loading,
        goBack,
        historyStack,
        currentFolder,
        files,
        fetchFolders,
        setHistoryStack
    } = useContext(ArchiveDataContext);

    const {
        gridView,
        formatSize,
    } = useContext(ArchiveUIContext);


    // Show loading state
    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-64">
                <div className="animate-spin">
                    <ArrowPathIcon className="w-12 h-12 text-gray-600" />
                </div>
                <p className="text-gray-500 text-sm">Cargando...</p>
            </div>
        );
    }

    

    return (
        <div className="my-4 relative">
            {currentFolder &&
                <div>
                    <h1 className="font-bold text-xl my-2">{currentFolder?.name}</h1>
                </div>
            }
            {historyStack.length > 0 &&
            <div className="flex gap-4 items-center underline">
                <div className={"p-2 rounded-full bg-gray-500 cursor-pointer w-max my-3"} onClick={goBack}>
                    <ArrowLeftIcon className={"w-5 h-5 text-white"} />
                </div>
                <div className = "cursor-pointer" onClick={()=>{
                    localStorage.removeItem("folder_id")
                    fetchFolders();
                    setHistoryStack([]);
                }}>
                    Home
                </div>
            </div>
            }
            <div className="flex justify-between px-4 border-b border-gray-400 py-3 my-3">
                <div>
                    <strong>Codigo / Nombre</strong>
                </div>

                <div className="flex gap-5">
                    <strong>Clasificación</strong>
                    <strong>Fecha de creación</strong>
                </div>
            </div>
            <div className="max-h-[350px] overflow-auto pb-10">

                <div
                    className={`${gridView ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'flex flex-col'} gap-3`}>



                    {(folders || []).map((folder) => (
                        <Folder key={folder.id} folder={folder} />
                    ))}

                    {(files || []).map((file) => (  
                        <FileExplorer key={file.id} file={file} />
                    ))}

                  

                </div>

            </div>
        </div>


    );
}

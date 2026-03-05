// ContainerFolders is the main component for displaying and managing the folder and file explorer UI. It handles navigation, folder history, and renders folders and files in the archive explorer.

import { useEffect } from "react";
import {
    ArrowPathIcon,
    ArrowLeftIcon,
} from "@heroicons/react/24/solid";

import Folder from "@/Components/ArchiveExplorer/Folder.jsx";
import FileExplorer from "@/Components/ArchiveExplorer/FileExplorer.jsx"
import SelectionActionBar from "./SelectionActionBar";
import { useExplorerData, useExplorerUI } from "@/Hooks/useExplorer";
import EmptyState from "../EmptyState";


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
        setHistoryStack,
        selectedItems,
        setIsMultipleSelection,
    } = useExplorerData();

    const {
        gridView,
        inputSearchTerm
    } = useExplorerUI();



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

    useEffect(() => {
        if (selectedItems.length > 1) {
            setIsMultipleSelection(true)
        }
        if (selectedItems.length === 0) {
            setIsMultipleSelection(false)
        }
    }, [selectedItems])



    return (
        <div className="relative my-4 flex flex-col h-full overflow-hidden">

            <div className="relative h-full pb-[12vh]">
                {/* It displays the current folder where it is located. */}
                {(selectedItems.length === 0) &&
                    <div>
                        <h1 className="font-bold text-lg my-2">
                            {
                                inputSearchTerm === "" ?
                                    <>
                                        {currentFolder?.name || "Raíz"}
                                    </>
                                    :
                                    "Modo busqueda "
                            }
                        </h1>
                    </div>
                }

                {(selectedItems.length > 0) &&
                    <SelectionActionBar />
                }
                {historyStack.length > 0 &&
                    <div className="flex gap-4 items-center underline bg-white">
                        <div className={"p-2 rounded-full bg-gray-500 cursor-pointer w-max my-3"} onClick={goBack}>
                            <ArrowLeftIcon className={"w-5 h-5 text-white"} />
                        </div>
                        <div className="cursor-pointer" onClick={() => {
                            localStorage.removeItem("folder_id")
                            fetchFolders();
                            setHistoryStack([]);
                        }}>
                            Inicio
                        </div>
                    </div>
                }

                {!gridView && (
                    <>
                        {(folders?.length !== 0 && files.length !== 0) &&
                            <div className={`flex justify-between px-4 py-3 bg-white  ${folders.length > 0 ? "border-b border-gray-300" : "border-none"} `}>
                                <div className="">
                                    <div className="truncate max-w-[50vw] w-full">
                                        <div className="flex">
                                            Codigo /
                                            <div className="flex flex-col md:flex-row">
                                                <span>
                                                    Nombre
                                                </span>
                                                <span className="text-xs md:hidden">
                                                    Clasificación
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <strong className="truncate max-w-[50vw] w-full hidden md:inline-block">Clasificación</strong>
                                <strong className="truncate max-w-[50vw] w-full">Fecha de creación</strong>
                            </div>
                        }
                    </>
                )}


                <div className="h-full overflow-x-hidden relative">
                    {folders?.length === 0 && files.length === 0 &&
                        <EmptyState text={"No hay carpetas o archivos disponibles."} />
                    }
                    <div
                        className={`${gridView ? 'grid grid-cols-2  gap-1 md:grid-cols-4 lg:grid-cols-5' : 'flex flex-col'} min-w-0  pb-[20vh]`}>
                        <>
                            {(folders || []).map((folder) => (
                                <Folder key={folder.id} folder={folder} />
                            ))}

                            {(files || []).map((file) => (
                                <FileExplorer key={file.id} file={file} />
                            ))}
                        </>

                    </div>

                </div>

            </div>
        </div>


    );
}

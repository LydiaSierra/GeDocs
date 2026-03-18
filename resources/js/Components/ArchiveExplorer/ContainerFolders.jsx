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
import ElectronicIndex from "@/Pages/ElectronicIndex";
import { Link, usePage } from "@inertiajs/react";


// Main ArchiveExplorer component

export default function ContainerFolders() {
    const { props } = usePage();
    const sheets = props?.sheets || [];

   const {
        folders,
       allFolders,
        loading,
        goBack,
        historyStack,
        currentFolder,
        files,
        fetchFolders,
        setHistoryStack,
        selectedItems,
        activeSheetId,
        setIsMultipleSelection,
    } = useExplorerData();

    const {
        gridView,
        inputSearchTerm
    } = useExplorerUI();

    const extractYearFromFolder = (folder) => {
        if (!folder) return null;

        if (folder?.year && !Number.isNaN(Number(folder.year))) {
            return Number(folder.year);
        }

        if (/^\d{4}$/.test(String(folder?.name || ""))) {
            return Number(folder.name);
        }

        return null;
    };

    const findYearFromCurrentPath = () => {
        if (!currentFolder || !Array.isArray(allFolders) || allFolders.length === 0) {
            return null;
        }

        const folderById = new Map(allFolders.map((folder) => [folder.id, folder]));
        let cursor = currentFolder;

        while (cursor) {
            const year = extractYearFromFolder(cursor);
            if (year) return year;

            cursor = cursor.parent_id ? folderById.get(cursor.parent_id) : null;
        }

        return null;
    };

    const handleHomeClick = () => {
        if (!currentFolder || !Array.isArray(allFolders) || allFolders.length === 0) {
            localStorage.removeItem("folder_id");
            fetchFolders(null, activeSheetId);
            setHistoryStack([]);
            return;
        }

        const folderById = new Map(allFolders.map(f => [f.id, f]));
        let rootFolder = currentFolder;
        
        while (rootFolder && rootFolder.parent_id) {
            const parent = folderById.get(rootFolder.parent_id);
            if (!parent) break;
            rootFolder = parent;
        }

        if (rootFolder) {
            localStorage.setItem("folder_id", JSON.stringify([rootFolder.id]));
            fetchFolders(rootFolder.id, activeSheetId);
            setHistoryStack([rootFolder.id]);
        } else {
            localStorage.removeItem("folder_id");
            fetchFolders(null, activeSheetId);
            setHistoryStack([]);
        }
    };

    const activeSheet = sheets.find((sheet) => sheet.id === activeSheetId);

    const currentYear = findYearFromCurrentPath()
        || Number(localStorage.getItem("active_sheet_year"))
        || new Date().getFullYear();

    const electronicIndexHref = route("electronic-index", {
        sheet_id: activeSheetId || undefined,
        sheet_number: activeSheet?.number || undefined,
        year: currentYear || undefined,
    });


    useEffect(() => {
        if (selectedItems.length > 1) {
            setIsMultipleSelection(true)
        }

        if (selectedItems.length === 0) {
            setIsMultipleSelection(false)
        }
    }, [selectedItems]);


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
        <div className="relative my-4 flex flex-col h-full overflow-hidden p-3">

            <div className="relative h-full pb-[12vh]">
                {/* It displays the current folder where it is located. */}
                {(selectedItems.length === 0) &&
                    <div className="w-full flex justify-between items-center">
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
                        <Link
                            href={electronicIndexHref}
                            className="bg-none text-primary font-semibold underline py-2 px-4"
                            onClick={() => {
                                if (activeSheetId) {
                                    localStorage.setItem("active_sheet_id", String(activeSheetId));
                                }

                                if (activeSheet?.number) {
                                    localStorage.setItem("active_sheet_number", String(activeSheet.number));
                                }

                                if (currentYear) {
                                    localStorage.setItem("active_sheet_year", String(currentYear));
                                }
                            }}
                        >
                                Indice
                        </Link>
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
                        <div className="cursor-pointer" onClick={handleHomeClick}>
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

                                <div className="flex items-center gap-8">
                                    <strong className="truncate max-w-[50vw]  hidden md:inline-block">Clasificación</strong>
                                    <strong className="truncate max-w-[50vw]">Fecha de creación</strong>
                                </div>
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

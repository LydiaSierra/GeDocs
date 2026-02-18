// InputSearch provides the search input and related controls for filtering files and folders in the archive explorer. It also includes view toggles and quick actions.
import { ArrowUpTrayIcon, Bars3Icon, DocumentPlusIcon, MagnifyingGlassIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import { usePage } from "@inertiajs/react";
import { Squares2X2Icon } from "@heroicons/react/24/solid";

import { toast } from "sonner";
import { useExplorerData, useExplorerUI } from "@/Hooks/useExplorer";

export const InputSearch = ({ handleSearch }) => {
    const { gridView, toggleGridView, showDropFolders, toggleDropFolders, setInputSearchTerm, inputSearchTerm } = useExplorerUI()
    const { currentFolder, deleteSelection, globalSearch } = useExplorerData();
    const url = usePage().url;

    return (
        <div id="inbox-search" className="flex w-full justify-between flex-wrap gap-1 ">
            {/* Search field */}
            <form onSubmit={(e) => {
                e.preventDefault();
                if (url === "/explorer") {
                    globalSearch(inputSearchTerm);
                }
            }} className="flex flex-1 md:flex-none items-center bg-base-200 px-2 rounded-md">
                <input
                    placeholder="Buscar"
                    type="text"
                    className="bg-base-200  text-black w-full focus:outline-none border-none p-4"
                    value={inputSearchTerm}
                    onChange={(e) => {
                        setInputSearchTerm(e.target.value);
                        if (e.target.value.trim() == "") {
                            if (url === "/explorer") {
                                globalSearch("");
                            }
                        }

                    }}
                />

                {inputSearchTerm ? (
                    <XMarkIcon
                        className="size-7 stroke-black hover:cursor-pointer"
                        onClick={() => {
                            setInputSearchTerm("");
                            globalSearch("")
                        }}
                    />
                ) : (
                    <MagnifyingGlassIcon
                        className="size-6 stroke-black hover:cursor-pointer"
                        onClick={() => handleSearch(inputSearchTerm)}
                    />
                )}
            </form>


            {url === "/explorer" &&
                <div className="w-full md:w-auto md:flex-1 flex items-center justify-between">
                    <div className="flex  gap-2">
                        {/* Filter button */}
                        <button
                            className={`p-4 rounded-md hover:cursor-pointer transition-colors duration-300 inline-block  
                            ${showDropFolders
                                    ? "text-white bg-primary active:bg-primary/50"
                                    : "bg-base-200  active:bg-gray-300 hover:bg-gray-300"
                                }`}
                            onClick={toggleDropFolders}
                        >
                            <Bars3Icon
                                className={`size-7  ${showDropFolders
                                    ? "text-white"
                                    : "text-gray-400"
                                    }`}
                            />
                        </button>

                        <button
                            className={`p-4 rounded-md hover:cursor-pointer transition-colors duration-300
                            ${gridView
                                    ? "bg-primary text-white active:bg-primary/50 md:hover:bg-primary"
                                    : "bg-base-200  active:bg-gray-300 md:hover:bg-gray-300"
                                }`}
                            onClick={toggleGridView}
                        >
                            <Squares2X2Icon
                                className={`size-7 ${gridView
                                    ? "text-white"
                                    : "text-gray-400"
                                    }`}
                            />
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 justify-end  md:w-max ">
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn bg-primary text-white">Acciones</div>
                            <ul tabIndex="-1" className="dropdown-content bg-base-200 p-2 rounded-box z-50 w-52 shadow-sm">

                                <button
                                    className="p-3 flex items-center gap-5 hover:bg-base-300/30 w-full rounded-md border-b border-gray-100"
                                    onClick={() => {
                                        deleteSelection();
                                        document.getElementById('createFolder').showModal();
                                    }
                                    }>
                                    <PlusIcon className="size-5" />

                                    Nueva Carpeta
                                </button>

                                <button
                                    className={`p-3 flex items-center gap-5 hover:bg-base-300/30 w-full rounded-md border-b border-gray-100 ${currentFolder ? "" : "opacity-20"}`}
                                    onClick={() => {
                                        if (currentFolder) {
                                            document.getElementById('uploadFile').showModal()
                                        } else {
                                            toast.warning("No se pueden subir archivos en la ubicación raíz");
                                        }


                                    }}
                                >
                                    <ArrowUpTrayIcon className="size-5" />
                                    Subir Archivo
                                </button>


                                <button
                                    className="p-3 flex items-center gap-5 hover:bg-base-300/30 w-full rounded-md border-b border-gray-100"
                                    onClick={() =>
                                        document.getElementById("my_modal_1").showModal()
                                    }
                                >
                                    <DocumentPlusIcon className="size-5" />

                                    Crear PDF
                                </button>
                            </ul>
                        </div>

                    </div>
                </div>



            }
        </div>
    );
};

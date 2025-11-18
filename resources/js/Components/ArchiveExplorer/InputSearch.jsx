import { Bars3Icon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { useContext } from "react";
import { usePage } from "@inertiajs/react";
import { Squares2X2Icon } from "@heroicons/react/24/solid";
import { ArchiveUIContext } from "@/context/ArchiveExplorer/ArchiveUIContext";

export const InputSearch = ({ inputSearchTerm, setInputSearchTerm, handleSearch }) => {
    const { gridView, toggleGridView, showDropFolders, toggleDropFolders } = useContext(ArchiveUIContext);
    const url = usePage().url;
    return (
        <div id="inbox-search" className="flex gap-3 flex-1 lg:flex-none">
            {/* Search field */}
            <div className="flex items-center bg-gray-100 px-2 rounded-md  max-w-sm">
                <input
                    placeholder="Buscar"
                    type="text"
                    className="bg-gray-100 text-black w-full focus:outline-none border-none p-4"
                    value={inputSearchTerm}
                    onChange={(e) => setInputSearchTerm(e.target.value)}
                />

                {inputSearchTerm ? (
                    <XMarkIcon
                        className="size-7 stroke-black hover:cursor-pointer"
                    />
                ) : (
                    <MagnifyingGlassIcon
                        className="size-7 stroke-black hover:cursor-pointer"
                        onClick={() => handleSearch(inputSearchTerm)}
                    />
                )}
            </div>


            {url === "/explorer" &&
                <>
                    {/* Filter button */}
                    <button
                        className={`p-4 rounded-md hover:cursor-pointer transition-colors duration-300
                            ${showDropFolders
                                ? "bg-primary text-white dark:bg-primary"
                                : "bg-gray-100 hover:bg-primary dark:bg-gray-700 dark:hover:bg-primary"
                            }`}
                        onClick={toggleDropFolders}
                    >
                        <Bars3Icon
                            className={`size-7 ${showDropFolders
                                ? "text-white"
                                : "text-gray-400"
                                }`}
                        />
                    </button>
                    
                    <button
                        className={`p-4 rounded-md hover:cursor-pointer transition-colors duration-300
                            ${gridView
                                ? "bg-primary text-white dark:bg-primary"
                                : "bg-gray-100 hover:bg-primary dark:bg-gray-700 dark:hover:bg-primary"
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
                </>
            }
        </div>
    );
};

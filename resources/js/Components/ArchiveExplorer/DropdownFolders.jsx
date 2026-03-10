// DropdownFolders provides a collapsible tree view for navigating all folders in the archive. It allows users to expand/collapse folder hierarchies and quickly jump between folders.
import React, { useContext, useEffect, useState } from "react";
import { ExplorerDataContext } from "@/context/Explorer/ExplorerDataContext";
import { ExplorerUIContext } from "@/context/Explorer/ExplorerUIContext";
import { FolderIcon } from "@heroicons/react/24/solid";
import { ArrowLeftCircleIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { usePage } from "@inertiajs/react";

const DropdownFolders = () => {
    const { showDropFolders, toggleDropFolders } = useContext(ExplorerUIContext);
    const { allFolders, openFolder, currentFolder, loadingAllFolders } = useContext(ExplorerDataContext);
    const { url } = usePage();

    const [expandedFolders, setExpandedFolders] = useState(new Set());

    const toggleFolder = (folderId) => {
        setExpandedFolders((prev) => {
            const next = new Set(prev);
            next.has(folderId) ? next.delete(folderId) : next.add(folderId);
            return next;
        });
    };

    useEffect(() => {
        if (!currentFolder || !allFolders?.length) return;

        const expanded = new Set();

        let parentId = currentFolder.parent_id;

        while (parentId) {
            expanded.add(parentId);
            const parent = allFolders.find(f => f.id === parentId);
            parentId = parent?.parent_id || null;
        }

        setExpandedFolders(prev => new Set([...prev, ...expanded]));
    }, [currentFolder, allFolders]);

    const renderFolders = (parentId = null) => {
        return (allFolders || [])
            .filter(folder => folder.parent_id === parentId)
            .map(folder => {
                const isExpanded = expandedFolders.has(folder.id);
                const hasChildren = allFolders.some(f => f.parent_id === folder.id);

                return (
                    <div
                        key={folder.id}
                        className={`ml-4 border-l pl-2 whitespace-nowrap w-max ${currentFolder?.id === folder.id
                            ? "border-primary/90 rounded-xl"
                            : "border-gray-300"
                            }`}
                    >
                        <div className="flex items-center gap-1 my-1">

                            {hasChildren ? (
                                <button
                                    type="button"
                                    onClick={() => toggleFolder(folder.id)}
                                    className="p-1 rounded hover:bg-gray-200"
                                >
                                    <ChevronRightIcon
                                        className={`w-4 transition-transform ${isExpanded ? "rotate-90" : ""
                                            }`}
                                    />
                                </button>
                            ) : (
                                <span className="w-6" />
                            )}

                            <div
                                onClick={() => openFolder(folder.id, true)}
                                className={`flex items-center gap-1 w-full  cursor-pointer p-1 rounded-md transition-all ${currentFolder?.id === folder.id
                                    ? "bg-primary/90 text-white"
                                    : "text-gray-500 hover:bg-gray-200 hover:pl-2"
                                    }`}
                            >
                                <FolderIcon className="w-4" />
                                <span className="text-sm whitespace-nowrap">
                                    {folder.name}
                                </span>
                            </div>
                        </div>

                        {isExpanded && renderFolders(folder.id)}
                    </div>
                );
            });
    };

    return (
        <>
            {url === "/explorer" && (
                <div
                    className={`${showDropFolders ? "left-0 w-screen md:w-full" : "-left-full md:w-0 overflow-hidden"
                        } transition-all origin-left md:pt-16 pb-2 md:max-w-[400px] z-10 duration-300 h-screen inline-block absolute md:static  w-full top-0 background-[url(/gedocs-logo.svg)]  bg-transparent`}
                >
                    <div
                        className={`bg-white p-2  rounded-lg w-full h-full mb-2  ${showDropFolders ? "overflow-auto " : "overflow-hidden"
                            }`}
                    >
                        <div className="flex gap-5 items-center md:justify-between border-b border-base-300 my-3 p-2">

                            <span className="md:order-1 md:cursor-pointer active:bg-primary/30 rounded-full" onClick={() => {
                                toggleDropFolders()
                            }}>
                                <ArrowLeftCircleIcon className="size-8" />
                            </span>
                            <p className="border-b py-2 font-medium">Carpetas</p>
                        </div>
                        {loadingAllFolders ?
                            <div className="p-2 flex items-center justify-center">Cargando Carpetas...</div>
                            :
                            <>
                                {renderFolders()}
                            </>
                        }
                    </div>
                </div>
            )}
        </>
    );
};

export default DropdownFolders;

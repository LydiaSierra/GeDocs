import React, { useContext, useEffect, useState } from "react";
import { ArchiveDataContext } from "@/context/ArchiveExplorer/ArchiveDataContext";
import { ArchiveUIContext } from "@/context/ArchiveExplorer/ArchiveUIContext";
import { FolderIcon } from "@heroicons/react/24/solid";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { usePage } from "@inertiajs/react";

const DropdownFolders = () => {
    const { showDropFolders } = useContext(ArchiveUIContext);
    const { allFolders, openFolder, currentFolder } = useContext(ArchiveDataContext);
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
                        className={`ml-4 border-l pl-2 whitespace-nowrap w-max ${
                            currentFolder?.id === folder.id
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
                                        className={`w-4 transition-transform ${
                                            isExpanded ? "rotate-90" : ""
                                        }`}
                                    />
                                </button>
                            ) : (
                                <span className="w-6" />
                            )}

                            <div
                                onClick={() => openFolder(folder.id, true)}
                                className={`flex items-center gap-1 w-full  cursor-pointer p-1 rounded-md transition-all ${
                                    currentFolder?.id === folder.id
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
                    className={`${
                        showDropFolders ? "w-full" : "w-0"
                    } transition-all origin-left pt-16 pb-2 max-w-[400px] duration-300 h-screen`}
                >
                    <div
                        className={`bg-white p-2 rounded-lg h-full ${
                            showDropFolders ? "overflow-auto" : "overflow-hidden"
                        }`}
                    >
                        <p className="border-b py-2 font-medium">Carpetas</p>
                        {renderFolders()}
                    </div>
                </div>
            )}
        </>
    );
};

export default DropdownFolders;

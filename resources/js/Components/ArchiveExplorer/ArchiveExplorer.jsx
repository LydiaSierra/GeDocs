"use client";

import {useContext, useEffect} from "react";
import {
    FolderIcon,
    DocumentIcon,
    ArrowPathIcon,
    ArrowDownTrayIcon,
    EllipsisVerticalIcon,
    InformationCircleIcon,
} from "@heroicons/react/24/solid";
import {Folder} from "./Folder";
import {ArchiveDataContext} from "@/context/ArchiveDataContext";
import {ArchiveUIContext} from "@/context/ArchiveUIContext";
import {usePage} from "@inertiajs/react";


// Main ArchiveExplorer component

export default function ArchiveExplorer() {
    const {
        files,
        folders,
        setFolders,
        parentId,
        navigateToFolder,
        loading,
    } = useContext(ArchiveDataContext);

    const {
        gridView,
        formatSize,
        handleModalDetails,
    } = useContext(ArchiveUIContext);

    const {folders: initalFolders} = usePage().props;

    useEffect(() => {
        setFolders(initalFolders)
    }, [initalFolders, parentId]);

// Show loading state
    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-64">
                <div className="animate-spin">
                    <ArrowPathIcon className="w-12 h-12 text-gray-600"/>
                </div>
                <p className="text-gray-500 text-sm">Cargando...</p>
            </div>
        );
    }

    // Function to handle entering a folder

    const enterFolder = (folder) => {
        if (!folder || folder.type !== "carpeta") return;
        navigateToFolder(folder.id, folder.name);
    };

    // Render the component based on the selected view (grid or table)

    return (
        <div className="overflow-x-auto w-full">
            {gridView ? (
                // Grid view
                <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
                    {(folders || []).map((folder) => (
                        <Folder key={folder.id} folder={folder} enterFolder={enterFolder}/>
                    ))}

                    {(files || []).map((file) => (
                        <div
                            key={file.id}
                            className="cursor-pointer border rounded-lg shadow-sm bg-white hover:shadow-md hover:bg-[#E8F9FB] transition p-4 flex flex-col items-center text-center relative"
                        >
                            <DocumentIcon className="w-12 h-12 text-gray-600 mb-2"/>
                            <p className="font-medium truncate w-full text-gray-700">
                                {file.name}
                            </p>
                            <p className="text-sm text-gray-500">{formatSize(file.size)}</p>

                            {/* Menu */}
                            <div className="dropdown dropdown-end absolute top-2 right-2">
                                <div
                                    tabIndex={0}
                                    role="button"
                                    className="z-1 border-none bg-transparent rounded-[50%] hover:bg-[#75D0D1]"
                                >
                                    <EllipsisVerticalIcon className="size-8 fill-gray-800 text-gray-800"/>
                                </div>
                                <ul className="dropdown-content menu bg-base-100 rounded-box w-40 p-2 shadow-sm">
                                    <li>
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 cursor-pointer"
                                            onClick={() => handleModalDetails("file", file)}
                                        >
                                            <InformationCircleIcon className="size-4 text-gray-700"/>
                                            Detalles
                                        </button>
                                    </li>
                                    <li>
                                        <a href={file.file_path || "#"} download>
                                            <ArrowDownTrayIcon className="size-4 text-gray-700"/>
                                            Descargar
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // Table view
                <table className="table border-separate border-spacing-y-2 w-full pb-15">
                    <thead className="sticky top-0">
                    <tr className="bg-gray-500 text-white text-lg">
                        <th className="rounded-l-lg p-2">
                            <input type="checkbox" className="checkbox border-white"/>
                        </th>
                        <th>
                            <FolderIcon className="size-10 opacity-0"/>
                        </th>
                        <th>Sección</th>
                        <th>Nombre</th>
                        <th>Última Modificación</th>
                        <th>Tamaño</th>
                        <th>Tipo</th>
                        <th className="rounded-r-lg"></th>
                    </tr>
                    </thead>

                    <tbody>

                    {(folders || []).map((folder) => (
                        <Folder key={folder.id} folder={folder} enterFolder={enterFolder}/>
                    ))}

                    {/* Files view */}

                    {(files || []).map((file) => (
                        <tr
                            key={file.id}
                            className="odd:bg-gray-100 hover:bg-[#A7F1FB] even:bg-gray-200 text-black cursor-pointer"
                        >
                            <td className="rounded-l-lg p-2">
                                <input type="checkbox" className="checkbox"/>
                            </td>
                            <td>
                                <DocumentIcon className="size-10 fill-gray-700 cursor-pointer"/>
                            </td>
                            <td>--</td>
                            <td>{file.name}</td>
                            <td>
                                {file.created_at
                                    ? new Date(file.created_at).toLocaleDateString()
                                    : "--"}
                            </td>
                            <td>{formatSize(file.size)}</td>
                            <td>{file.tipo || "Archivo"}</td>
                            <td className="flex justify-center gap-3 rounded-r-lg">
                                <div className="border-none bg-transparent rounded-[50%] hover:bg-[#75D0D1]">
                                    <a href={file.file_path || "#"} download>
                                        <ArrowDownTrayIcon className="size-4 text-gray-700"/>
                                    </a>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

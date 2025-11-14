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
import {FolderRow} from "./FolderRow.jsx";
import {ArchiveDataContext} from "@/context/ArchiveDataContext";
import {ArchiveUIContext} from "@/context/ArchiveUIContext";
import {usePage} from "@inertiajs/react";
import FolderGrid from "@/Components/ArchiveExplorer/FolderGrid.jsx";


// Main ArchiveExplorer component

export default function ArchiveExplorer() {
    const {
        files,
        folders,
        setFolders,
        setFiles,
        parentId,
        navigateToFolder,
        loading,
    } = useContext(ArchiveDataContext);

    const {
        gridView,
        formatSize,
        handleModalDetails,
    } = useContext(ArchiveUIContext);

    const { folders: initialFolders, files: initialFiles, parent_id } = usePage().props;

    useEffect(() => {
        setFolders(initialFolders);
        setFiles(initialFiles);
    }, [initialFolders, initialFiles, parent_id]);

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
    console.log(folders)
    // Render the component based on the selected view (grid or table)

    return (
        <>
            {gridView ? (
                // Grid view
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                    {(folders || []).map((folder) => (
                        <FolderGrid key={folder.id} folder={folder} enterFolder={enterFolder}/>
                    ))}

                </div>
            ) : (
                // Table view
                <>
                    <table className="hidden lg:table border-separate border-spacing-y-2 w-full pb-15">
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
                            <FolderRow key={folder.id} folder={folder} enterFolder={enterFolder}/>
                        ))}

                        {/* Files view */}
                        {(files || []).map((file) => (
                            <tr
                                key={file.id}
                                onDoubleClick={()=> window.open(`http://127.0.0.1:8000/storage/${file.file_path}`)}
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

                    {/*Table view Responsive*/}
                    <div className={'flex flex-col lg:hidden'}>
                        {(folders || []).map((folder) => (
                            <FolderGrid key={folder.id} folder={folder} enterFolder={enterFolder}/>

                        ))}

                        {(files || []).map((file) => (
                            <tr
                                key={file.id}
                                className="odd:bg-gray-100 hover:bg-[#A7F1FB] even:bg-gray-200 text-black cursor-pointer"
                                onDoubleClick={()=> window.open(`http://127.0.0.1:8000/storage/${file.file_path}`)}
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
                    </div>
                </>
            )}
        </>

    );
}

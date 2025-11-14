"use client";

import {useContext, useEffect} from "react";
import {
    FolderIcon,
    DocumentIcon,
    ArrowPathIcon,
    ArrowDownTrayIcon,
    EllipsisVerticalIcon,
    InformationCircleIcon, ArrowLeftIcon,
} from "@heroicons/react/24/solid";
import {ArchiveDataContext} from "@/context/ArchiveExplorer/ArchiveDataContext.jsx";
import {ArchiveUIContext} from "@/context/ArchiveExplorer/ArchiveUIContext.jsx";
import {usePage} from "@inertiajs/react";
import Folder from "@/Components/ArchiveExplorer/Folder.jsx";
import {RightClickContext} from "@/context/ArchiveExplorer/RightClickContext.jsx";


// Main ArchiveExplorer component

export default function ArchiveExplorer() {
    const {
        files,
        folders,
        loading,
        goBack,
        historyStack
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
                    <ArrowPathIcon className="w-12 h-12 text-gray-600"/>
                </div>
                <p className="text-gray-500 text-sm">Cargando...</p>
            </div>
        );
    }

    return (
        <>
            {historyStack.length > 0 &&
                <div className={"p-2 rounded-full bg-gray-500 cursor-pointer w-max"} onClick={goBack}>
                    <ArrowLeftIcon className={"w-5 h-5 text-white"}/>
                </div>
            }
            {gridView ? (
                // Grid view
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                    {(folders || []).map((folder) => (
                        <Folder key={folder.id} folder={folder}/>
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
                            <th>Código Sección</th>
                            <th>Clasificación</th>
                            <th>Nombre</th>
                            <th>Última Modificación</th>
                            <th>Tamaño</th>
                            <th>Tipo</th>
                            <th className="rounded-r-lg"></th>
                        </tr>
                        </thead>

                        <tbody>

                        {(folders || []).map((folder) => (
                            <Folder key={folder.id} folder={folder}/>
                        ))}

                        {/* Files view */}
                        {(files || []).map((file) => (
                            <tr
                                key={file.id}
                                onDoubleClick={() => window.open(`http://127.0.0.1:8000/storage/${file.file_path}`)}
                                className="odd:bg-gray-100 hover:bg-[#A7F1FB] even:bg-gray-200 text-black cursor-pointer"
                                onContextMenu={(e) => showContextMenu(e, "file")}
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
                            <Folder key={folder.id} folder={folder}/>

                        ))}

                        {(files || []).map((file) => (
                            <tr
                                key={file.id}
                                className="odd:bg-gray-100 hover:bg-[#A7F1FB] even:bg-gray-200 text-black cursor-pointer"
                                onDoubleClick={() => window.open(`http://127.0.0.1:8000/storage/${file.file_path}`)}
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

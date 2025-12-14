import { useContext } from "react";
import { ArchiveUIContext } from "@/context/ArchiveExplorer/ArchiveUIContext.jsx";
import { RightClickContext } from "@/context/ArchiveExplorer/RightClickContext.jsx";
import { ArchiveDataContext } from "@/context/ArchiveExplorer/ArchiveDataContext.jsx";
import { ArrowDownTrayIcon, EllipsisVerticalIcon, FolderIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import { BellAlertIcon, ExclamationTriangleIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { usePage } from "@inertiajs/react";
import { toast } from "sonner";
import Modal from "../Modal";


const Folder = ({ folder }) => {
    const { gridView, showDetails, setSelectedFolder } = useContext(ArchiveUIContext);
    const { openFolder, deleteFolder } = useContext(ArchiveDataContext);
    const role = usePage().props.auth.user.roles[0].name
    const canEdit = role === "Admin" || role === "Instructor"

    return (
        <>
            {gridView ?
                <div
                    key={folder.id}
                    onDoubleClick={() => {
                        openFolder(folder.id, true)

                    }}
                    className="cursor-pointer border-b lg:border lg:rounded-lg shadow-sm bg-white hover:shadow-md relative hover:bg-[#E8F9FB] transition p-2 lg:p-4 flex lg:flex-col text-center select-none items-center justify-between h-max"
                >
                    <div className={'flex lg:flex-col items-center gap-3'}>
                        <FolderIcon className="w-12 h-12 text-gray-500 lg:mb-2" />
                        <p className="font-medium line-clamp-1 text-gray-700">{folder.name}</p>
                    </div>

                    {/* Button of options*/}
                    <div className="dropdown dropdown-end lg:absolute lg:top-2 lg:right-2 ">
                        <div
                            tabIndex={0}
                            role="button"
                            className="z-1 border-none bg-transparent rounded-full hover:bg-[#75D0D1]"
                        >
                            <EllipsisVerticalIcon className="size-8 fill-gray-700" />
                        </div>
                        <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                            <li onClick={() => {
                                toast.info("Aun no se ha implementado la descarga de carpetas")
                            }}>
                                <a
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded cursor-pointer"
                                >
                                    <ArrowDownTrayIcon className="w-5 h-5 text-gray-600" />
                                    <span>Descargar</span>
                                </a>
                            </li>
                            <li>
                                <button
                                    onClick={() => showDetails(folder)}
                                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded"
                                >
                                    <InformationCircleIcon className="w-5 h-5 text-gray-600" />
                                    <span>Detalles</span>
                                </button>
                            </li>

                            {canEdit &&
                                <>
                                    <li>
                                        <button
                                            onClick={() => document.getElementById('createFolder').showModal()}
                                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded"
                                        >
                                            <PencilSquareIcon className="w-5 h-5 text-gray-600" />
                                            <span>Editar</span>
                                        </button>
                                    </li>

                                    <li>
                                        <button
                                            onClick={() => {
                                                document.getElementById('confirmDeleteFolder').showModal()
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 rounded"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                            <span>Eliminar</span>
                                        </button>
                                    </li>
                                </>
                            }
                        </ul>
                    </div>
                </div>
                :
                <div className="flex flex-col">
                    <div key={folder.id} className="flex justify-between border-b border-gray-400 px-2 py-4 cursor-pointer hover:bg-gray-100" onDoubleClick={() => {
                        openFolder(folder.id, true)
                    }}>
                        <div className="flex gap-2 items-center font-medium">
                            <FolderIcon className="w-8 text-gray-800" />
                            <p><span className="text-gray-600">{folder.folder_code}</span> - {folder.name}</p>
                        </div>

                        <div className="flex gap-5 items-center">
                            <p className="w-26">{folder.departament}</p>
                            <p>{new Date(folder.created_at).toLocaleDateString()}</p>
                            {/* OPTIONS BUTTON */}
                            <div className={`dropdown dropdown-bottom dropdown-end ${gridView ? "absolute right-2 left-2" : "relative"}`}>
                                <button tabIndex={"-1"} role="button" className="p-1 rounded-full hover:bg-gray-300 cursor-pointer">
                                    <EllipsisVerticalIcon className="w-6" />
                                </button>
                                <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                    <li onClick={() => {
                                        toast.info("Aun no se ha implementado la descarga de carpetas")
                                    }}>
                                        <a
                                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded cursor-pointer"
                                        >
                                            <ArrowDownTrayIcon className="w-5 h-5 text-gray-600" />
                                            <span>Descargar</span>
                                        </a>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => showDetails(folder)}
                                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded"
                                        >
                                            <InformationCircleIcon className="w-5 h-5 text-gray-600" />
                                            <span>Detalles</span>
                                        </button>
                                    </li>

                                    {canEdit &&
                                        <>
                                            <li>
                                                <button
                                                    onClick={() => {
                                                        document.getElementById('createFolder').showModal();
                                                        setSelectedFolder(folder);
                                                    }
                                                    }
                                                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded"
                                                >
                                                    <PencilSquareIcon className="w-5 h-5 text-gray-600" />
                                                    <span>Editar</span>
                                                </button>
                                            </li>

                                            <li>
                                                <button
                                                    onClick={() =>
                                                        document.getElementById('confirmDeleteFolder').showModal()
                                                    }
                                                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 rounded"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                    <span>Eliminar</span>
                                                </button>
                                            </li>
                                        </>
                                    }

                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            }

            <dialog id="confirmDeleteFolder" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-xl text-red-600  text-center">
                        {/* ICON OF ALERT */}
                        <ExclamationTriangleIcon className="w-6 h-6 inline-block mr-2" />
                        ADVERTENCIA!
                    </h3>
                    <p className="py-4 font-bold text-center">
                        Si elimina esta carpeta, se eliminarán todos los archivos y subcarpetas dentro de ella.
                    </p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn border-gray-500 bg-transparent m-2">Cancelar</button>
                            <button className="btn bg-red-600  text-white m-2" onClick={() => deleteFolder(folder.id)}>Eliminar</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    )
}

export default Folder;


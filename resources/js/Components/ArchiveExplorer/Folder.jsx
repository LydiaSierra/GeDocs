import {useContext} from "react";
import {ArchiveUIContext} from "@/context/ArchiveExplorer/ArchiveUIContext.jsx";
import {RightClickContext} from "@/context/ArchiveExplorer/RightClickContext.jsx";
import {ArchiveDataContext} from "@/context/ArchiveExplorer/ArchiveDataContext.jsx";
import {ArrowDownTrayIcon, EllipsisVerticalIcon, FolderIcon, InformationCircleIcon} from "@heroicons/react/24/solid";


const Folder = ({folder})=>{
    const {gridView, handleModalDetails} = useContext(ArchiveUIContext);
    const {showContextMenu } = useContext(RightClickContext);
    const {handleFolderNavegation} = useContext(ArchiveDataContext);
    return(
        <>
            {gridView ?
                <div
                    key={folder.id}
                    onContextMenu={(e)=> {showContextMenu(e, "folder")}}
                    className="cursor-pointer border-b lg:border lg:rounded-lg shadow-sm bg-white hover:shadow-md relative hover:bg-[#E8F9FB] transition p-2 lg:p-4 flex lg:flex-col text-center select-none items-center justify-between"
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
                        <ul className="dropdown-content menu bg-base-100 rounded-box w-40 p-2 shadow-sm">
                            <li>
                                <button
                                    type="button"
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => handleModalDetails("folder", folder)}
                                >
                                    <InformationCircleIcon className="size-4 fill-gray-700" />
                                    Detalles
                                </button>
                            </li>
                            <li>
                                <a>
                                    <ArrowDownTrayIcon className="size-4 fill-gray-700" />
                                    Descargar
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                :
                <tr
                    key={folder.id}
                    className="odd:bg-gray-100 hover:bg-[#A7F1FB] even:bg-gray-200 text-black cursor-pointer"
                    onContextMenu={(e) => showContextMenu(e, 'folder')}
                    onDoubleClick={()=>handleFolderNavegation(folder.id)}
                >
                    <td className="rounded-l-lg p-2">
                        <input
                            type="checkbox"
                            className="checkbox"
                            onDoubleClick={(e) => e.stopPropagation()}
                        />
                    </td>
                    <td>
                        <FolderIcon className="size-10 text-gray-700 cursor-pointer" />
                    </td>
                    <td>{folder.folder_code ?? "--"}</td>
                    <td>{folder.departament ?? "--"}</td>
                    <td>{folder.name}</td>
                    <td>{new Date(folder.updated_at).toLocaleDateString()}</td>
                    <td>--</td>
                    <td>{folder.type || "Carpeta"}</td>
                    <td className="flex justify-center gap-3 rounded-r-lg">
                        <div className="border-none bg-transparent rounded-full hover:bg-[#75D0D1]">
                            <ArrowDownTrayIcon className="size-7 m-1 text-gray-700" />
                        </div>
                    </td>
                </tr>
            }
        </>
    )
}

export default  Folder;


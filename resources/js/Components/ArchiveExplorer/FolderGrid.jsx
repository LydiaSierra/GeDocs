import React, {useContext} from 'react';
import {ArrowDownTrayIcon, EllipsisVerticalIcon, FolderIcon, InformationCircleIcon} from "@heroicons/react/24/solid";
import {ArchiveDataContext} from "@/context/ArchiveDataContext.jsx";
import {ArchiveUIContext} from "@/context/ArchiveUIContext.jsx";

const FolderGrid = ({folder}) => {
    const {navigateToFolder} = useContext(ArchiveDataContext);
    const {handleModalDetails} = useContext(ArchiveUIContext);

    return (
        <div
            key={folder.id}
            onDoubleClick={() => navigateToFolder(folder.id, folder.name)}
            className="cursor-pointer border-b lg:border lg:rounded-lg shadow-sm bg-white hover:shadow-md relative hover:bg-[#E8F9FB] transition p-2 lg:p-4 flex lg:flex-col text-center select-none items-center justify-between"
        >
            <div className={'flex lg:flex-col items-center gap-3'}>
                <FolderIcon className="w-12 h-12 text-gray-500 lg:mb-2"/>
                <p className="font-medium line-clamp-1 text-gray-700">{folder.name}</p>
            </div>

            {/* Button of options*/}
            <div className="dropdown dropdown-end lg:absolute lg:top-2 lg:right-2 ">
                <div
                    tabIndex={0}
                    role="button"
                    className="z-1 border-none bg-transparent rounded-full hover:bg-[#75D0D1]"
                >
                    <EllipsisVerticalIcon className="size-8 fill-gray-700"/>
                </div>
                <ul className="dropdown-content menu bg-base-100 rounded-box w-40 p-2 shadow-sm">
                    <li>
                        <button
                            type="button"
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => handleModalDetails("folder", folder)}
                        >
                            <InformationCircleIcon className="size-4 fill-gray-700"/>
                            Detalles
                        </button>
                    </li>
                    <li>
                        <a>
                            <ArrowDownTrayIcon className="size-4 fill-gray-700"/>
                            Descargar
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default FolderGrid;

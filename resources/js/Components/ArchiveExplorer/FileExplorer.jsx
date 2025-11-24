import { useContext } from "react";
import { ArchiveUIContext } from "@/context/ArchiveExplorer/ArchiveUIContext.jsx";
import { RightClickContext } from "@/context/ArchiveExplorer/RightClickContext.jsx";
import { ArchiveDataContext } from "@/context/ArchiveExplorer/ArchiveDataContext.jsx";

import {
    ArrowDownTrayIcon,
    EllipsisVerticalIcon,
    InformationCircleIcon,
    DocumentIcon,
    PhotoIcon,
} from "@heroicons/react/24/solid";

const File = ({ file }) => {
    const { gridView, } = useContext;
    const { deleteFile } = useContext(ArchiveDataContext);

    const open = () => {
        window.open(file.url, "_blank");
    };


    return (
        <>
            {gridView ? (
                /** GRID VIEW **/
                <div
                    key={file.id}
                    className="cursor-pointer border-b lg:border lg:rounded-lg shadow-sm bg-white hover:shadow-md relative hover:bg-[#E8F9FB] transition p-2 lg:p-4 flex lg:flex-col text-center select-none items-center justify-between"
                    onDoubleClick={open}
                >
                    {/* ICON + NAME */}
                    <div className="flex lg:flex-col items-center gap-3">

                        {file.is_image ? (
                            <img
                                src={file.url}
                                alt={file.name}
                                className="w-12 h-12 object-cover rounded-md"
                            />
                        ) : file.is_pdf ? (
                            <DocumentIcon className="w-12 h-12 text-red-600 lg:mb-2" />
                        ) : (
                            <DocumentIcon className="w-12 h-12 text-gray-600 lg:mb-2" />
                        )}

                        <p className="font-medium line-clamp-1 text-gray-700">
                            {file.name}
                        </p>
                    </div>

                    {/* OPTIONS BUTTON */}
                    <div className="dropdown dropdown-end lg:absolute lg:top-2 lg:right-2">
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
                                >
                                    <InformationCircleIcon className="size-4 fill-gray-700" />
                                    Detalles
                                </button>
                            </li>

                            <li>
                                <button
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={handleDownload}
                                >
                                    <ArrowDownTrayIcon className="size-4 fill-gray-700" />
                                    Descargar
                                </button>
                            </li>

                            <li>
                                <button
                                    className="flex items-center gap-2 cursor-pointer text-red-600"
                                    onClick={() => deleteFile(file.id)}
                                >
                                    Eliminar
                                </button>
                            </li>

                        </ul>
                    </div>

                </div>
            ) : (
                /** LIST VIEW **/
                <div className="flex flex-col">
                    <div
                        key={file.id}
                        className="flex justify-between border-b border-gray-400 px-2 py-4 cursor-pointer hover:bg-gray-100"
                        onDoubleClick={open}
                    >

                        <div className="flex gap-2 items-center font-medium">

                            {file.is_image ? (
                                <PhotoIcon className="w-8 text-blue-500" />
                            ) : file.is_pdf ? (
                                <DocumentIcon className="w-8 text-red-600" />
                            ) : (
                                <DocumentIcon className="w-8 text-gray-800" />
                            )}

                            <p>{file.name}</p>
                        </div>

                        <div className="flex gap-5 items-center">
                            <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>

                            <button className="p-1 rounded-full hover:bg-gray-300 cursor-pointer">
                                <EllipsisVerticalIcon className="w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default File;

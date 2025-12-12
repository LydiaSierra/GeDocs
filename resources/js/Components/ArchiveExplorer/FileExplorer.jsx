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
import { Link } from "@inertiajs/react";

const File = ({ file }) => {
    const { gridView, showDetails } = useContext(ArchiveUIContext);
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
                    <div className="flex lg:flex-col items-center gap-3 w-full select-none">

                        {file.is_image ? (
                            <PhotoIcon className="w-8 text-blue-500" />
                        ) : file.is_pdf ? (
                            <div className="w-12 h-14">
                                <iframe src={file.url} frameborder="0" className="w-full h-full object-cover"></iframe>
                            </div>
                        ) : (
                            <DocumentIcon className="w-8 text-gray-800" />
                        )}

                        <p className="font-medium w-full truncate text-gray-700 hover:underline">
                            {file.name}
                        </p>
                    </div>

                    {/* OPTIONS BUTTON */}
                    <div className={`dropdown dropdown-bottom dropdown-end ${gridView ? "absolute right-2 left-2" : "relative"}`}>
                        <button tabIndex={"-1"} role="button" className="p-1 rounded-full hover:bg-gray-300 cursor-pointer">
                            <EllipsisVerticalIcon className="w-6" />
                        </button>
                        <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                            <li><a href={file.url} download={file.name}>Descargar</a></li>
                            <li><button onClick={() => showDetails(file)}>Detalles</button></li>
                        </ul>
                    </div>

                </div>
            ) : (
                /** LIST VIEW **/
                <div className="flex flex-col">
                    <div
                        key={file.id}
                        className="flex justify-between border-b border-gray-400 px-2 py-4 cursor-pointer hover:bg-gray-100  select-none"
                    >

                        <div className={`flex ${gridView ? "flex-col" : " gap-2 items-center font-medium"}`}>
                            {file.is_image ? (
                                <PhotoIcon className="w-8 text-blue-500" />
                            ) : file.is_pdf ? (
                                <div className="w-12 h-14">
                                    <iframe src={file.url} frameborder="0" className="w-full h-full object-cover"></iframe>
                                </div>
                            ) : (
                                <DocumentIcon className="w-8 text-gray-800" />
                            )}

                            <p className="hover:underline" onDoubleClick={open}>{file.name}</p>
                        </div>

                        <div className="flex gap-5 items-center">
                            <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>

                            <div className="dropdown dropdown-bottom dropdown-end">
                                <button tabIndex={"-1"} role="button" className="p-1 rounded-full hover:bg-gray-300 cursor-pointer">
                                    <EllipsisVerticalIcon className="w-6" />
                                </button>
                                <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                    <li><a href={file.url} download={file.name}>Descargar</a></li>
                                    <li><button onClick={() => showDetails(file)}>Detalles</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default File;


import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Squares2X2Icon, PlusIcon } from "@heroicons/react/24/outline";
import ArchiveExplorer from "@/components/ArchiveExplorer/ArchiveExplorer";
import { InputSearch } from "@/components/ArchiveExplorer/InputSearch";
import { BreadCrumb } from "@/components/ArchiveExplorer/BreadCrumb";
import { ModalDetails } from "@/components/ArchiveExplorer/ModalDetails";
import { useContext, useEffect } from "react";
import { ArchiveUIContext } from "@/context/ArchiveExplorer/ArchiveUIContext";
import { router, usePage } from "@inertiajs/react";
import RightClickGlobal from "@/Components/ArchiveExplorer/Modals/ModalRightClick/RightClickGlobal";
import { ArchiveDataContext } from "@/context/ArchiveExplorer/ArchiveDataContext";
import ModalHandleFolder from "@/Components/ArchiveExplorer/Modals/ModalHandleFolder";
import { RightClickContext } from "@/context/ArchiveExplorer/RightClickContext";
import RightClickFolder from "@/Components/ArchiveExplorer/Modals/ModalRightClick/RightClickFolder";
import RightClickFile from "@/Components/ArchiveExplorer/Modals/ModalRightClick/RightClickFile";

export default function Explorer() {
    const { gridView, toggleGridView, showModal } = useContext(ArchiveUIContext);
    const { contextMenu, showContextMenu, hideContextMenu } = useContext(RightClickContext);
    const { parent_id } = usePage().props;


    useEffect(() => {
        window.addEventListener('click', hideContextMenu);
        return () => window.removeEventListener('click', hideContextMenu);
    }, [])



    return (
        <section className="bg-senaGray dark:bg-gray-800 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300 relative">
            <Navbar />
            <div className="flex">
                <Sidebar />

                <div
                    className="flex flex-col h-[calc(100vh-80px)] w-full bg-white dark:bg-gray-800 lg:m-5 rounded-lg p-2 lg:p-5 gap-3 overflow-y-auto transition-colors duration-300 lg:shadow-md dark:shadow-none"
                    onContextMenu={(e) => showContextMenu(e, 'global')}
                >
                    <div className="flex gap-3 items-center justify-center lg:justify-start">
                        <InputSearch />

                        <button
                            className={`p-4 rounded-md hover:cursor-pointer transition-colors duration-300
                            ${gridView
                                    ? "bg-green-700 text-white dark:bg-green-600"
                                    : "bg-gray-100 hover:bg-green-100 dark:bg-gray-700 dark:hover:bg-green-900"
                                }`}
                            onClick={toggleGridView}
                        >
                            <Squares2X2Icon
                                className={`size-7 ${gridView
                                    ? "stroke-white"
                                    : "stroke-gray-800 dark:stroke-gray-200"
                                    }`}
                            />
                        </button>
                    </div>

                    <ArchiveExplorer />

                    {showModal && <ModalDetails />}

                    {contextMenu.visible && contextMenu.type === 'global' && <RightClickGlobal />}
                    {contextMenu.visible && contextMenu.type === 'folder' && <RightClickFolder />}
                    {contextMenu.visible && contextMenu.type === 'file' && <RightClickFile />}

                    <ModalHandleFolder />
                </div>
            </div>
        </section>
    );
}

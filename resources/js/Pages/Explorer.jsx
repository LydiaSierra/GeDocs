
import Sidebar from "@/components/Sidebar/Sidebar";
import { Squares2X2Icon } from "@heroicons/react/24/outline";
import { InputSearch } from "@/components/ArchiveExplorer/InputSearch";
import { ModalDetails } from "@/components/ArchiveExplorer/ModalDetails";
import { useContext, useEffect } from "react";
import { ArchiveUIContext } from "@/context/ArchiveExplorer/ArchiveUIContext";
import { router, usePage } from "@inertiajs/react";
import RightClickGlobal from "@/Components/ArchiveExplorer/Modals/ModalRightClick/RightClickGlobal";
import ModalHandleFolder from "@/Components/ArchiveExplorer/Modals/ModalHandleFolder";
import { RightClickContext } from "@/context/ArchiveExplorer/RightClickContext";
import RightClickFolder from "@/Components/ArchiveExplorer/Modals/ModalRightClick/RightClickFolder";
import RightClickFile from "@/Components/ArchiveExplorer/Modals/ModalRightClick/RightClickFile";
import Header from "@/Components/Header/Header";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import ContainerFolders from "@/Components/ArchiveExplorer/ContainerFolders";

export default function Explorer() {
    const { gridView, toggleGridView, showModal } = useContext(ArchiveUIContext);
    const { contextMenu, showContextMenu, hideContextMenu } = useContext(RightClickContext);
    const { parent_id } = usePage().props;




    useEffect(() => {
        window.addEventListener('click', hideContextMenu);
        return () => window.removeEventListener('click', hideContextMenu);
    }, [])



    return (

        <>
            <DashboardLayout>
                <div className="bg-white h-full rounded-lg p-2 relative">
                    <InputSearch />
                    <ContainerFolders />
                </div>

            </DashboardLayout>
        </>




    );
}

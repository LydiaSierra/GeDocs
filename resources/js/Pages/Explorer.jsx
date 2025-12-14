
import { InputSearch } from "@/components/ArchiveExplorer/InputSearch";
import { useContext, useEffect, useState } from "react";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import ContainerFolders from "@/Components/ArchiveExplorer/ContainerFolders";
import { ArchiveDataContext } from "@/context/ArchiveExplorer/ArchiveDataContext";
import UploadModal from "@/Components/ArchiveExplorer/Modals/UploadModal";
import { ModalDetails } from "@/Components/ArchiveExplorer/Modals/ModalDetails";
import { ArchiveUIContext } from "@/context/ArchiveExplorer/ArchiveUIContext";
import DependencyScheme from "@/Components/DependencyScheme/DependencyScheme";
import CreateFolderModal from "@/Components/ArchiveExplorer/Modals/ModalCreateOrEditFolder";
import { usePage } from "@inertiajs/react";
import ModalCreateOrEditFolder from "@/Components/ArchiveExplorer/Modals/ModalCreateOrEditFolder";

export default function Explorer() {
    const { openFolder, setHistoryStack, fetchFolders, currentFolder, getAllFolders } = useContext(ArchiveDataContext);
    const { selectedItem } = useContext(ArchiveUIContext);
    const [openModalUpload, setopenModalUpload] = useState(false);
    const role = usePage().props.auth.user.roles[0].name
    const canEdit = role === "Admin" || role === "Instructor"






    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem("folder_id"));

        if (savedHistory?.length > 0) {
            setHistoryStack(savedHistory);
            const lastFolder = savedHistory[savedHistory.length - 1];
            openFolder(lastFolder, false);
        } else {
            fetchFolders()
        }
        getAllFolders()

    }, [])


    return (

        <>
            <DashboardLayout>
                <div className="bg-white h-full rounded-lg p-2 relative">
                    <div className="flex justify-between items-center ">
                        <InputSearch />
                        <div className="flex items-center gap-2 ">

                            {currentFolder &&
                                <button className="py-2 px-4 rounded-md bg-primary text-white cursor-pointer"
                                    onClick={() => {
                                        setopenModalUpload(true)
                                    }}
                                >
                                    Subir Archivo
                                </button>
                            }
                            {canEdit &&
                                <button className="py-2 px-4 rounded-md border border-primary text-primary cursor-pointer" onClick={() => document.getElementById('createFolder').showModal()
                                }>
                                    Nueva Carpeta
                                </button>
                            }
                        </div>
                    </div>
                    <ContainerFolders />


                    {openModalUpload &&
                        <UploadModal onOpen={setopenModalUpload} />
                    }
                    {selectedItem &&
                        <ModalDetails />
                    }
                        <ModalCreateOrEditFolder />



                </div>


                {/* <DependencyScheme /> */}
            </DashboardLayout>
        </>




    );
}

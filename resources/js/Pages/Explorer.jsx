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
import ToastPdf from "@/Components/ToastPdf";

export default function Explorer() {
    const {
        openFolder,
        setHistoryStack,
        fetchFolders,
        currentFolder,
        getAllFolders,
    } = useContext(ArchiveDataContext);
    const { selectedItem } = useContext(ArchiveUIContext);
    const [openModalUpload, setopenModalUpload] = useState(false);
    const role = usePage().props.auth.user.roles[0].name
    const canEdit = role === "Admin" || role === "Instructor"





    const [showPdfToast, setShowPdfToast] = useState(false);
    

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem("folder_id"));

        if (savedHistory?.length > 0) {
            setHistoryStack(savedHistory);
            const lastFolder = savedHistory[savedHistory.length - 1];
            openFolder(lastFolder, false);
        } else {
            fetchFolders();
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
                        {currentFolder && (
                            <button
                                className="py-2 px-4 rounded-md bg-primary text-white cursor-pointer"
                                onClick={() => {
                                    setopenModalUpload(true);
                                }}
                            >
                                Subir Archivo
                            </button>
                        )}
                    </div>
                    <ContainerFolders />

                    {/* Open the modal using document.getElementById('ID').showModal() method */}
                    <button
                        className="btn absolute right-12 bg-primary text-white"
                        onClick={() =>
                            document.getElementById("my_modal_1").showModal()
                        }
                    >
                        Crear PDF
                    </button>
                    <dialog id="my_modal_1" className="modal">
                        <div className="modal-box">
                            <h1 className="text-xl text-center">
                                {" "}
                                Formulario PDF{" "}
                            </h1>
                            <DependencyScheme onPdfGenerated={() => setShowPdfToast(true)}/>
                            <div className="modal-action">
                                <div className="modal-action">
                                    <button
                                        type="submit"
                                        form="pdfForm"
                                        className="btn bg-primary text-white"
                                    >
                                        Crear
                                    </button>
                                </div>
                            </div>
                        </div>
                    </dialog>

                    {openModalUpload && (
                        <UploadModal onOpen={setopenModalUpload} />
                    )
                    }

                    {selectedItem &&
                        <ModalDetails />
                    }
                        <ModalCreateOrEditFolder />

                </div>


                
            </DashboardLayout>
            <ToastPdf
                    show={showPdfToast}
                    onClose={() => setShowPdfToast(false)}
                />
        </>
    );
}

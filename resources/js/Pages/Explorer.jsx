import { InputSearch } from "@/components/ArchiveExplorer/InputSearch";
import { useContext, useEffect, useState } from "react";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import ContainerFolders from "@/Components/ArchiveExplorer/ContainerFolders";
import { ArchiveDataContext } from "@/context/ArchiveExplorer/ArchiveDataContext";
import UploadModal from "@/Components/ArchiveExplorer/Modals/UploadModal";
import { ModalDetails } from "@/Components/ArchiveExplorer/Modals/ModalDetails";
import { ArchiveUIContext } from "@/context/ArchiveExplorer/ArchiveUIContext";
import DependencyScheme from "@/Components/DependencyScheme/DependencyScheme";
import { usePage } from "@inertiajs/react";
import ModalCreateOrEditFolder from "@/Components/ArchiveExplorer/Modals/ModalCreateOrEditFolder";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function Explorer() {
    const {
        openFolder,
        setHistoryStack,
        fetchFolders,
        currentFolder,
        getAllFolders,
    } = useContext(ArchiveDataContext);
    const { selectedItem } = useContext(ArchiveUIContext);
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
                <div className="bg-white h-full rounded-lg p-2 relative flex flex-col min-h-0 overflow-x-hidden">
                    <div className="flex justify-between items-center flex-wrap gap-4 ">
                        <InputSearch />
                        <div className="flex w-full md:w-max justify-center flex-wrap items-center gap-2 ">
                            {currentFolder &&
                                <button className="py-2 px-4 rounded-md bg-primary text-white cursor-pointer"
                                    onClick={() => {
                                        document.getElementById("uploadFile").showModal();
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

                    <dialog id="my_modal_1" className="modal w-full">
                        <div className="modal-box w-[95vw] sm:w-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl h-auto max-h-[85vh] overflow-y-auto">
                            <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>

                            <h1 className="text-2xl text-center my-2 font-bold">
                                Formulario PDF
                            </h1>
                            <DependencyScheme onPdfGenerated={() => setShowPdfToast(true)} />
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

                        <form method="dialog" className="modal-backdrop">
                            <button>close</button>
                        </form>

                    </dialog>

                        <UploadModal />
                  

                    {selectedItem &&
                        <ModalDetails />
                    }
                    <ModalCreateOrEditFolder />

                    
                </div>



            </DashboardLayout>

        </>
    );
}

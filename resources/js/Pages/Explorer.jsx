import { InputSearch } from "@/components/ArchiveExplorer/InputSearch";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import ContainerFolders from "@/Components/ArchiveExplorer/ContainerFolders";
import UploadModal from "@/Components/ArchiveExplorer/Modals/UploadModal";
import { ModalDetails } from "@/Components/ArchiveExplorer/Modals/ModalDetails";
import DependencyScheme from "@/Components/DependencyScheme/DependencyScheme";
import ModalCreateOrEditFolder from "@/Components/ArchiveExplorer/Modals/ModalCreateOrEditFolder";
import { ArrowLeftCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import InformationDrawer from "@/Components/ArchiveExplorer/InformationDrawer";
import { useExplorerData } from "@/Hooks/useExplorer";

export default function Explorer() {
    const {
        openFolder,
        setHistoryStack,
        fetchFolders,
        getAllFolders,
        deleteSelectionItemsMixed,
        selectedItems
    } = useExplorerData();
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
                <div className="bg-white h-full rounded-lg p-2 relative flex flex-col min-h-0 overflow-x-hidden ">
                    <div className="md:hidden flex justify-center items-center relative bg-white border-b border-gray-300 rounded-br-md rounded-bl-md p-4 mb-4">
                        <ArrowLeftCircleIcon className="size-8 absolute left-5 top-1/2 -translate-y-1/2" onClick={() => {
                            window.history.back()
                        }} />
                        <h1>Explora tus archivos</h1>
                    </div>
                    <InputSearch />

                    <ContainerFolders />

                    <dialog id="my_modal_1" className="modal w-full">
                        <div
                            className="modal-box w-[95vw] sm:w-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl h-auto max-h-[85vh] overflow-y-auto">
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

                    <ModalDetails />

                    <ModalCreateOrEditFolder />

                    <InformationDrawer />

                    <dialog id="confirmDeleteFolder" className="modal">
                        <div className="modal-box">
                            <h3 className="font-bold text-xl text-red-600  text-center">
                                {/* ICON OF ALERT */}
                                <ExclamationTriangleIcon className="w-6 h-6 inline-block mr-2" />
                                ADVERTENCIA!
                            </h3>
                            <p className="py-4 font-bold text-center">
                                Este segura(o) de eliminar {selectedItems.length > 1 ? "estos elementos" : "este elemento"}
                            </p>
                            <div className="modal-action">
                                <form method="dialog" className="flex justify-center items-center w-full">
                                    <button className="btn border-gray-500 bg-transparent m-2">Cancelar</button>
                                    <button className="btn bg-red-600  text-white m-2" onClick={deleteSelectionItemsMixed}>Eliminar</button>
                                </form>
                            </div>
                        </div>
                    </dialog>


                </div >



            </DashboardLayout >

        </>
    );
}

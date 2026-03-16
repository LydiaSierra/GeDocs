import { InputSearch } from "@/Components/ArchiveExplorer/InputSearch";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import ContainerFolders from "@/Components/ArchiveExplorer/ContainerFolders";
import UploadModal from "@/Components/ArchiveExplorer/Modals/UploadModal";
import { ModalDetails } from "@/Components/ArchiveExplorer/Modals/ModalDetails";
import DependencyScheme from "@/Components/DependencyScheme/DependencyScheme";
import ModalCreateOrEditFolder from "@/Components/ArchiveExplorer/Modals/ModalCreateOrEditFolder";
import { ArrowLeftCircleIcon, DocumentArrowDownIcon, DocumentTextIcon, ExclamationTriangleIcon, FolderIcon } from "@heroicons/react/24/outline";
import InformationDrawer from "@/Components/ArchiveExplorer/InformationDrawer";
import { useExplorerData } from "@/Hooks/useExplorer";
import { usePage, router } from "@inertiajs/react";

export default function Explorer() {
    const {
        setHistoryStack,
        fetchFolders,
        deleteSelectionItemsMixed,
        selectedItems,
        activeSheetId,
        setActiveSheetId,
        setIsMultipleSelection, // Added setIsMultipleSelection
    } = useExplorerData();
    const [showPdfToast, setShowPdfToast] = useState(false);
    const { sheets, filters } = usePage().props;

    const handleSelectSheet = (sheetId) => {
        fetchFolders(null, sheetId);
        localStorage.setItem("active_sheet_id", sheetId);
        localStorage.removeItem("folder_id"); // Clear folder_id when selecting a new sheet
        setHistoryStack([]);
    };

    const handleBackToSheets = () => {
        localStorage.removeItem("active_sheet_id");
        localStorage.removeItem("folder_id"); // Clear folder_id when going back to sheets
        router.get(route('explorer'), {}, {
            onSuccess: () => {
                setActiveSheetId(null);
                setHistoryStack([]);
            }
        });
    };

    useEffect(() => {
        // Restore history stack for UI breadcrumbs from localStorage
        const savedHistory = JSON.parse(localStorage.getItem("folder_id"));
        if (savedHistory?.length > 0) {
            setHistoryStack(savedHistory);
        }
        // Clear active_sheet_id from localStorage if it's not set in props (e.g., after logout or direct navigation to explorer without sheet)
        if (!activeSheetId && localStorage.getItem("active_sheet_id")) {
            localStorage.removeItem("active_sheet_id");
            localStorage.removeItem("folder_id");
        }
    }, [activeSheetId]); // Depend on activeSheetId to re-evaluate when it changes

    return (
        <>
            <DashboardLayout>
                <div className="bg-white h-full rounded-lg p-2 relative flex flex-col min-h-0 overflow-x-hidden ">
                    <div className="md:hidden flex justify-center items-center relative bg-white border-b border-gray-300 rounded-br-md rounded-bl-md p-4 mb-4">
                        <ArrowLeftCircleIcon 
                            className="size-8 absolute left-5 top-1/2 -translate-y-1/2 cursor-pointer" 
                            onClick={() => {
                                if (activeSheetId) {
                                    handleBackToSheets();
                                } else {
                                    window.history.back();
                                }
                            }} 
                        />
                        <h1>{activeSheetId ? "Explora tus archivos" : "Selecciona una ficha"}</h1>
                    </div>

                    {!activeSheetId ? (
                        /* ====== SHEET SELECTION VIEW ====== */
                        <div className="flex flex-col h-full">
                            <h2 className="font-bold text-2xl mb-4 text-center mt-4">
                                Selecciona una ficha
                            </h2>
                            <p className="text-gray-500 text-center text-sm mb-6">
                                Elige una ficha para ver sus carpetas y archivos
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                                {sheets.map((sheet) => (
                                    <button
                                        key={sheet.id}
                                        onClick={() => handleSelectSheet(sheet.id)}
                                        className="group flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                                    >
                                        <FolderIcon className="size-10 text-gray-400 group-hover:text-primary transition-colors" />
                                        <span className="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors">
                                            Ficha {sheet.number}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {sheets.length === 0 && (
                                <div className="flex flex-col items-center justify-center p-10 text-gray-600 text-center font-bold w-full">
                                    <div className="relative flex justify-center items-center">
                                        <p className="absolute z-1">No hay fichas disponibles</p>
                                        <div className="h-full w-full">
                                            <img
                                                className="opacity-60 lg:h-110"
                                                src="/images/OBJECTS.svg"
                                                alt=""
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* ====== FOLDER EXPLORER VIEW ====== */
                        <>
                            <div className="hidden md:flex items-center gap-2 mb-2">
                                <button
                                    onClick={handleBackToSheets}
                                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors cursor-pointer"
                                >
                                    <ArrowLeftCircleIcon className="size-5" />
                                    Volver a fichas
                                </button>
                                <span className="text-gray-300">|</span>
                                <span className="text-sm font-bold text-primary">
                                    Ficha {sheets.find(s => s.id === activeSheetId)?.number}
                                </span>
                            </div>

                            <InputSearch />

                            <ContainerFolders />

                            <dialog id="my_modal_1" className="modal w-full">
                                <div className="modal-box w-[95vw] sm:w-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl h-auto max-h-[90vh] overflow-y-auto">
                                    <form method="dialog">
                                        <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 z-10">✕</button>
                                    </form>

                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <DocumentTextIcon className="w-6 h-6 text-primary" />
                                        <h2 className="text-xl font-bold text-base-content">
                                            Generar Comunicación PDF
                                        </h2>
                                    </div>
                                    <p className="text-sm text-gray-500 text-center mb-6">
                                        Complete los campos para generar el documento de comunicación oficial.
                                    </p>

                                    <DependencyScheme onPdfGenerated={() => setShowPdfToast(true)} />

                                    <div className="modal-action border-t border-base-300 pt-4 mt-6">
                                        <form method="dialog">
                                            <button className="btn btn-ghost">Cancelar</button>
                                        </form>
                                        <button
                                            type="submit"
                                            form="pdfForm"
                                            className="btn bg-primary hover:bg-green-700 text-white gap-2"
                                        >
                                            <DocumentArrowDownIcon className="w-5 h-5" />
                                            Generar PDF
                                        </button>
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
                                        <ExclamationTriangleIcon className="w-6 h-6 inline-block mr-2" />
                                        ADVERTENCIA!
                                    </h3>
                                    <p className="py-4 font-bold text-center">
                                        Este segura(o) de eliminar {selectedItems.length > 1 ? "estos elementos" : "este elemento"}
                                    </p>
                                    <div className="modal-action">
                                        <form method="dialog" className="flex justify-center items-center w-full">
                                            <button className="btn border-gray-500 bg-transparent m-2">Cancelar</button>
                                            <button className="btn bg-red-600 text-white m-2" onClick={deleteSelectionItemsMixed}>Eliminar</button>
                                        </form>
                                    </div>
                                </div>
                            </dialog>
                        </>
                    )}
                </div>
            </DashboardLayout>
        </>
    );
}

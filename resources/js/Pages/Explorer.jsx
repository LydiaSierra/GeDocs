import { InputSearch } from "@/Components/ArchiveExplorer/InputSearch";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import ContainerFolders from "@/Components/ArchiveExplorer/ContainerFolders";
import UploadModal from "@/Components/ArchiveExplorer/Modals/UploadModal";
import { ModalDetails } from "@/Components/ArchiveExplorer/Modals/ModalDetails";
import DependencyScheme from "@/Components/DependencyScheme/DependencyScheme";
import ModalCreateOrEditFolder from "@/Components/ArchiveExplorer/Modals/ModalCreateOrEditFolder";
import { ArrowLeftCircleIcon, CalendarIcon, DocumentArrowDownIcon, DocumentTextIcon, ExclamationTriangleIcon, FolderIcon } from "@heroicons/react/24/outline";
import InformationDrawer from "@/Components/ArchiveExplorer/InformationDrawer";
import { useExplorerData } from "@/Hooks/useExplorer";
import { usePage } from "@inertiajs/react";
import ModalCreateYear from "@/Components/ArchiveExplorer/Modals/ModalCreateYear";

export default function Explorer() {
    const {
        openFolder,
        setHistoryStack,
        fetchFolders,
        getAllFolders,
        deleteSelectionItemsMixed,
        selectedItems,
        activeSheetId,
        setActiveSheetId,
        folders,
        currentFolder,
        loading,
    } = useExplorerData();
    const [showPdfToast, setShowPdfToast] = useState(false);
    const { sheets, filters } = usePage().props;

    const handleSelectSheet = (sheetId) => {
        setActiveSheetId(sheetId);

        localStorage.setItem("active_sheet_id", sheetId);

        localStorage.removeItem("folder_id");
        setHistoryStack([]);

        fetchFolders(null, sheetId);
        getAllFolders();
    };


    const handleBackToSheets = () => {
        setActiveSheetId(null);

        localStorage.removeItem("active_sheet_id");

        localStorage.removeItem("folder_id");
        setHistoryStack([]);
    };


    useEffect(() => {

        const savedSheet = localStorage.getItem("active_sheet_id");

        if (savedSheet) {
            const sheetId = Number(savedSheet);

            setActiveSheetId(sheetId);

            const savedHistory = JSON.parse(localStorage.getItem("folder_id"));

            if (savedHistory?.length > 0) {
                setHistoryStack(savedHistory);
                const lastFolder = savedHistory[savedHistory.length - 1];
                openFolder(lastFolder, false);
            } else {
                fetchFolders(null, sheetId);
            }

            getAllFolders();
        }

    }, []);


    return (
        <>
            <DashboardLayout>
                <div className="bg-white h-full rounded-lg p-2 relative flex flex-col min-h-0 overflow-x-hidden ">
                    <div className="md:hidden flex justify-center items-center relative bg-white border-b border-gray-300 rounded-br-md rounded-bl-md p-4 mb-4">
                        <ArrowLeftCircleIcon className="size-8 absolute left-5 top-1/2 -translate-y-1/2" onClick={() => {
                            if (activeSheetId) {
                                handleBackToSheets();
                            } else {
                                window.history.back();
                            }
                        }} />
                        <h1>{activeSheetId ? "Explora tus archivos" : "Selecciona una ficha"}</h1>
                    </div>

                    {(!currentFolder && !filters?.buscador) ? (
                        /* ====== DUAL COLUMN SELECTION VIEW ====== */
                        <div className="flex flex-col md:flex-row h-full overflow-hidden border border-gray-100 rounded-xl shadow-sm">
                            {/* LEFT COLUMN: Sheets (Fichas/Tabs) List */}
                            <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-100 bg-gray-50/30 flex flex-col h-full">
                                <div className="p-4 border-b border-gray-100 bg-white">
                                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                        <FolderIcon className="size-5 text-primary" />
                                        Selecciona una ficha
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">Elige una ficha para gestionar sus archivos por periodos.</p>
                                </div>
                                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                    {sheets.map((sheet) => (
                                        <button
                                            key={sheet.id}
                                            onClick={() => handleSelectSheet(sheet.id)}
                                            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all text-left ${
                                                activeSheetId === sheet.id
                                                    ? "bg-primary text-white shadow-md ring-1 ring-primary-focus"
                                                    : "bg-white hover:bg-primary/5 text-gray-700 border border-gray-100"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`size-8 flex items-center justify-center rounded-full ${
                                                    activeSheetId === sheet.id ? "bg-white/20" : "bg-primary/10"
                                                }`}>
                                                    <span className="font-bold text-xs">#</span>
                                                </div>
                                                <span className="font-bold text-sm">Ficha {sheet.number}</span>
                                            </div>
                                            {activeSheetId === sheet.id && (
                                                <div className="size-2 bg-white rounded-full animate-pulse"></div>
                                            )}
                                        </button>
                                    ))}
                                    {sheets.length === 0 && (
                                        <div className="p-4 text-center text-gray-400 text-sm italic">No hay fichas disponibles</div>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT COLUMN: Years List */}
                            <div className="flex-1 flex flex-col h-full bg-white relative">
                                {!activeSheetId ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-10 text-center">
                                        <div className="size-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                            <FolderIcon className="size-10 text-gray-200" />
                                        </div>
                                        <h4 className="font-bold text-xl text-gray-300">Bienvenido al Explorador</h4>
                                        <p className="max-w-xs mt-2">Selecciona una ficha del panel izquierdo para ver sus periodos anuales.</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col h-full">
                                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                                    <CalendarIcon className="size-5 text-primary" />
                                                    Años de la Ficha {sheets.find(s => s.id === activeSheetId)?.number}
                                                </h3>
                                                <p className="text-xs text-gray-500 mt-1">Elige un periodo para explorar sus carpetas documentales.</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1 overflow-y-auto p-4">
                                            {loading ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
                                                    {[1, 2, 3, 4].map((i) => (
                                                        <div key={i} className="animate-pulse bg-gray-50 border-2 border-gray-100 rounded-2xl h-48 flex flex-col items-center justify-center p-8 gap-3">
                                                            <div className="size-14 bg-gray-200 rounded-2xl"></div>
                                                            <div className="h-6 w-20 bg-gray-200 rounded"></div>
                                                            <div className="h-3 w-24 bg-gray-100 rounded"></div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
                                                    {folders.filter(f => !f.parent_id && (f.year || !isNaN(f.name))).map((yearFolder) => (
                                                        <button
                                                            key={yearFolder.id}
                                                            onClick={() => openFolder(yearFolder.id, true)}
                                                            className="group relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-gray-100 bg-white hover:border-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                                                        >
                                                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                                                <CalendarIcon className="size-12 text-primary rotate-12" />
                                                            </div>
                                                            <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                                <CalendarIcon className="size-8 text-primary" />
                                                            </div>
                                                            <div className="text-center">
                                                                <span className="block text-2xl font-black text-gray-800 group-hover:text-primary transition-colors">
                                                                    {yearFolder.name}
                                                                </span>
                                                                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold group-hover:text-primary/70 transition-colors">
                                                                    Periodo Anual
                                                                </span>
                                                            </div>
                                                        </button>
                                                    ))}
                                                    
                                                    {/* Option to create a new year manually if needed */}
                                                    <button
                                                        onClick={() => document.getElementById('createYearModal').showModal()}
                                                        className="group flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 hover:border-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                                                    >
                                                        <div className="size-12 flex items-center justify-center rounded-2xl bg-gray-100 group-hover:bg-primary/20 transition-all duration-300">
                                                            <span className="text-3xl text-gray-400 group-hover:text-primary font-light">+</span>
                                                        </div>
                                                        <span className="text-sm font-bold text-gray-400 group-hover:text-primary transition-colors text-center px-4 leading-tight">
                                                            Nuevo Año
                                                        </span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* ====== FOLDER EXPLORER VIEW ====== */
                        <>
                            <div className="hidden md:flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                                <button
                                    onClick={handleBackToSheets}
                                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors cursor-pointer"
                                >
                                    <ArrowLeftCircleIcon className="size-5" />
                                    Panel de Selección
                                </button>
                                <span className="text-gray-300">|</span>
                                <span className="text-sm font-bold text-primary">
                                    Ficha {sheets.find(s => s.id === activeSheetId)?.number}
                                </span>
                                {currentFolder && (
                                    <>
                                        <span className="text-gray-300">/</span>
                                        <span className="text-sm font-medium text-gray-500">
                                            {currentFolder.name}
                                        </span>
                                    </>
                                )}
                            </div>

                            <InputSearch />

                            <ContainerFolders />

                            <dialog id="my_modal_1" className="modal w-full">
                                <div
                                    className="modal-box w-[95vw] sm:w-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl h-auto max-h-[90vh] overflow-y-auto">
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
                        </>
                    )}

                    {/* ALWAYS RENDERED MODALS */}
                    <ModalCreateOrEditFolder />
                    <ModalCreateYear />
                </div >



            </DashboardLayout >

        </>
    );
}

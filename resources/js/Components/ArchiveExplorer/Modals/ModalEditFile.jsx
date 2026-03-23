import { useEffect, useState } from "react";
import { getSelectedItem, useExplorerData } from "@/Hooks/useExplorer";
import { DocumentTextIcon, PencilSquareIcon, CalendarIcon, HashtagIcon, KeyIcon } from "@heroicons/react/24/outline";

export const ModalEditFile = () => {
    const { updateFile } = useExplorerData();
    const selectedItem = getSelectedItem();
    
    const [name, setName] = useState("");
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        if (selectedItem?.type === 'file') {
            setName(selectedItem.pure_name || "");
            setYear(selectedItem.year || new Date().getFullYear());
        }
    }, [selectedItem?.id, selectedItem?.pure_name]);

    // Reset when modal closes
    useEffect(() => {
        const modal = document.getElementById("modalEditFile");
        if (!modal) return;

        const onClosed = () => {
            if (selectedItem?.type === 'file') {
                setName(selectedItem.pure_name || "");
                setYear(selectedItem.year || new Date().getFullYear());
            }
        };

        modal.addEventListener("close", onClosed);
        return () => modal.removeEventListener("close", onClosed);
    }, [selectedItem]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !selectedItem) return;

        updateFile({
            fileId: selectedItem.id,
            name: name.trim(),
            year: year
        });

        document.getElementById("modalEditFile").close();
    };

    return (
        <dialog id="modalEditFile" className="modal">
            <div className="modal-box rounded-3xl p-8 max-w-lg bg-white">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
                </form>

                <div className="flex items-center gap-3 mb-6">
                    <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <PencilSquareIcon className="size-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-black text-xl text-gray-800 tracking-tight">
                            Editar Archivo
                        </h3>
                        <p className="text-xs text-gray-500 font-medium italic">
                            Ajusta el año y nombre original respetando la nomenclatura.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    <div className="grid grid-cols-2 gap-4">
                        {/* AÑO (Editable con limites) */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                Año
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <CalendarIcon className="size-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="number"
                                    max={new Date().getFullYear()}
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-primary rounded-2xl text-sm font-bold text-gray-700 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* RADICADO (Solo lectura) */}
                        <div className="space-y-2 opacity-60">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                Radicado (N°)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <HashtagIcon className="size-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={selectedItem?.file_code || ""}
                                    readOnly
                                    className="block w-full pl-11 pr-4 py-3 bg-gray-100 border-0 ring-1 ring-gray-200 rounded-2xl text-sm font-bold text-gray-500 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* HASH (Solo lectura) */}
                    <div className="space-y-2 opacity-60">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            Hash de Seguridad
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <KeyIcon className="size-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={selectedItem?.hash || ""}
                                readOnly
                                className="block w-full pl-11 pr-4 py-3 bg-gray-100 border-0 ring-1 ring-gray-200 rounded-2xl text-xs font-mono font-medium text-gray-500 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* NOMBRE ORIGINAL */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            Nombre Original del Archivo
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <DocumentTextIcon className="size-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full pl-11 pr-4 py-3 bg-gray-50 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-primary rounded-2xl text-sm font-bold text-gray-700 transition-all placeholder:text-gray-400"
                                placeholder="Ej: Mi documento"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => document.getElementById("modalEditFile").close()}
                            className="btn btn-ghost flex-1 rounded-2xl font-bold order-2 sm:order-1 h-12"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn bg-primary hover:bg-primary/90 text-white flex-1 rounded-2xl border-0 shadow-lg shadow-primary/20 font-bold order-1 sm:order-2 h-12"
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop bg-black/20 backdrop-blur-sm">
                <button>close</button>
            </form>
        </dialog>
    );
};

export default ModalEditFile;

import api from "@/lib/axios";
import { UserContext } from "@/context/UserContext/UserContext";
import React, { useContext, useState, useEffect, useCallback } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { toast } from "sonner";
import { usePage } from "@inertiajs/react";

function UserEditPanel() {
    const { props } = usePage();
    const authRole = props?.auth?.user?.roles?.[0]?.name;
    const { idSelected, setEdit, UpdateInfo } = useContext(UserContext);

    const [nombre, setNombre] = useState("");
    const [documento, setDocumento] = useState("");
    const [numero_documento, setNumeroDocumento] = useState("");
    const [email, setEmail] = useState("");
    const [estado, setEstado] = useState("");
    const [sheets, setSheets] = useState([]);
    const [selectedSheets, setSelectedSheets] = useState([]);

    const close = useCallback(() => setEdit(false), [setEdit]);

    useEffect(() => {
        const handleKey = (e) => { if (e.key === "Escape") close(); };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [close]);

    useEffect(() => {
        if (idSelected) {
            setNombre(idSelected.name);
            setDocumento(idSelected.type_document);
            setNumeroDocumento(idSelected.document_number);
            setEmail(idSelected.email);
            setEstado(idSelected.status);
            if (idSelected.sheet_numbers) {
                setSelectedSheets(idSelected.sheet_numbers.map((sheet) => sheet.id));
            }
        }
    }, [idSelected]);

    const toggleSheet = (sheetId) => {
        if (selectedSheets.includes(sheetId)) {
            setSelectedSheets(selectedSheets.filter((id) => id !== sheetId));
        } else {
            setSelectedSheets([...selectedSheets, sheetId]);
        }
    };

    useEffect(() => {
        const fetchSheets = async () => {
            if (authRole === 'Instructor') {
                const res = await api.get("/api/sheetsNumber");
                setSheets(res.data.fichas || []);
            } else {
                const res = await api.get("/api/sheets");
                setSheets(res.data.sheets || []);
            }
        };
        fetchSheets();
    }, [authRole]);

    const UploadUser = async () => {
        let toastId;
        if (numero_documento.length > 10) {
            toast.error("El número de documento no puede tener más de 10 caracteres");
            return;
        }
        if (nombre.length < 3) {
            toast.error("El nombre debe tener al menos 3 caracteres");
            return;
        }
        if (email.length < 5 || !email.includes("@")) {
            toast.error("Ingrese un correo electrónico válido");
            return;
        }
        if (estado === "") {
            toast.error("Seleccione un estado Valido");
            return;
        }
        try {
            toastId = toast.loading("Actualizando información");
            await UpdateInfo(nombre, documento, numero_documento, email, estado, idSelected.id, selectedSheets);
            toast.success("Información actualizada");
        } catch (err) {
            toast.error(err?.response?.data?.message || err?.message || err || "Error al hacer la petición");
        } finally {
            if (toastId) toast.dismiss(toastId);
        }
    };

    const inputClass = "w-full h-10 border border-gray-300 rounded-lg px-3 text-sm bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary focus:outline-none transition-shadow";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-3"
            onClick={close}
        >
            <div
                className="w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
                    <button
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={close}
                    >
                        <ArrowUturnLeftIcon className="size-5 text-gray-500" />
                    </button>
                    <h3 className="font-bold text-lg sm:text-xl text-gray-800">
                        {idSelected?.roles[0]?.name === "Instructor" ? "Editar Instructor" : "Editar Aprendiz"}
                    </h3>
                    <button
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={close}
                    >
                        <XMarkIcon className="size-5 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">
                    {/* Profile header */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-100 shrink-0">
                            <img
                                className="w-full h-full object-cover"
                                alt="profile pic"
                                src={idSelected.profile_photo || "/images/default-user-icon.png"}
                            />
                        </div>
                        <h2 className="font-semibold text-base sm:text-lg text-gray-800 truncate">{idSelected?.name}</h2>
                    </div>

                    {/* Form grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Nombres</label>
                            <input type="text" className={inputClass} value={nombre} onChange={(e) => setNombre(e.target.value)} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo Documento</label>
                            <select className={inputClass} value={documento} onChange={(e) => setDocumento(e.target.value)}>
                                <option value="">Seleccione</option>
                                <option value="CC">Cédula</option>
                                <option value="TI">Tarjeta</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Número Documento</label>
                            <input type="text" className={inputClass} value={numero_documento} onChange={(e) => setNumeroDocumento(e.target.value)} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</label>
                            <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</label>
                            <select className={inputClass} value={estado} onChange={(e) => setEstado(e.target.value)}>
                                <option value="">Seleccione estado</option>
                                <option value="pending">Pendiente</option>
                                <option value="active">Activo</option>
                            </select>
                        </div>

                        {/* Sheets selector */}
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Asignar Fichas</label>

                            <div className="border border-gray-200 rounded-xl bg-gray-50 p-4 flex flex-col gap-3">
                                <div className="flex flex-wrap gap-2 min-h-7">
                                    {selectedSheets.length > 0 ? (
                                        selectedSheets.map((sheetId) => {
                                            const sheet = sheets.find((s) => s.id === sheetId);
                                            return (
                                                <span key={sheetId} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                                    {sheet?.number}
                                                    <button type="button" onClick={() => toggleSheet(sheetId)} className="hover:text-primary/70">
                                                        <XMarkIcon className="size-3.5" />
                                                    </button>
                                                </span>
                                            );
                                        })
                                    ) : (
                                        <span className="text-xs text-gray-400">No hay fichas seleccionadas</span>
                                    )}
                                </div>

                                <div className="max-h-40 overflow-y-auto border-t border-gray-200 pt-3 flex flex-col gap-0.5">
                                    {sheets.map((sheet) => {
                                        const isSelected = selectedSheets.includes(sheet.id);
                                        return (
                                            <div
                                                key={sheet.id}
                                                onClick={() => toggleSheet(sheet.id)}
                                                className={`cursor-pointer px-3 py-2 rounded-lg text-sm flex items-center transition-colors ${
                                                    isSelected ? "bg-primary text-white" : "hover:bg-white"
                                                }`}
                                            >
                                                {sheet.number}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 px-5 sm:px-6 py-4 flex justify-end gap-3 bg-white">
                    <button
                        className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                        onClick={close}
                    >
                        Cancelar
                    </button>
                    <button
                        className="px-5 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:opacity-90 transition-opacity"
                        onClick={UploadUser}
                    >
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserEditPanel;

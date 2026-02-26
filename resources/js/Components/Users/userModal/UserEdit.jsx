import api from "@/lib/axios";
import { UserContext } from "@/context/UserContext/UserContext";
import React, { useContext, useState, useEffect } from "react";
import { ArrowUturnLeftIcon, CameraIcon } from "@heroicons/react/24/solid";
import { toast } from "sonner";
import { router, usePage } from "@inertiajs/react";

function UserEdit() {
    // traemos los contextos
    const { idSelected, setEdit, UpdateInfo} =
        useContext(UserContext);

    // declaracion de varianle y useState
    const [nombre, setNombre] = useState("");
    const [documento, setDocumento] = useState("");
    const [numero_documento, setNumeroDocumento] = useState("");
    const [email, setEmail] = useState("");
    const [estado, setEstado] = useState("");
    const [sheets, setSheets] = useState([]);
const [selectedSheets, setSelectedSheets] = useState([]);
    
    useEffect(() => {
    if (idSelected) {
        setNombre(idSelected.name);
        setDocumento(idSelected.type_document);
        setNumeroDocumento(idSelected.document_number);
        setEmail(idSelected.email);
        setEstado(idSelected.status);

        if (idSelected.sheet_numbers) {
            setSelectedSheets(
                idSelected.sheet_numbers.map((sheet) => sheet.id)
            );
        }
    }
}, [idSelected]);
    const toggleSheet = (sheetId) => {
    if (selectedSheets.includes(sheetId)) {
        setSelectedSheets(selectedSheets.filter(id => id !== sheetId));
    } else {
        setSelectedSheets([...selectedSheets, sheetId]);
    }
};

    const [loadingEdit, setLoadingEdit] = useState(false);

    // UseEffect para cargar el toast

    useEffect(() => {
        if (idSelected) {
            setLoadingEdit(true);
        } else {
            setLoadingEdit(false);
        }
    }, []);
    useEffect(() => {
    const fetchSheets = async () => {
        const res = await api.get("/api/sheets");
        setSheets(res.data.sheets);
    };

    fetchSheets();
}, []);

    // funcion que llama la funcion de editar usuario del contexto mientras activa y desactiva los toast
    const UploadUser = async () => {
        let toastId;
        // validaciones de inputs
        if(numero_documento.length > 10){
            toast.error("El número de documento no puede tener más de 10 caracteres");
            return;
        }
        if(nombre.length < 3){
            toast.error("El nombre debe tener al menos 3 caracteres");
            return;
        }
        if(email.length < 5 || !email.includes("@")){
            toast.error("Ingrese un correo electrónico válido");
            return;
        }
        if(estado === ""){
            toast.error("Seleccione un estado Valido");
            return;
        }
        try {
            toastId = toast.loading("Actualizando información");
            await UpdateInfo(
                nombre,
                documento,
                numero_documento,
                email,
                estado,
                idSelected.id,
            );
            toast.success("Información actualizada");
        } catch (err) {
            toast.error(
                err?.response?.data?.message ||
                    err?.message ||
                    err ||
                    "Error al hacer la petición",
            );
        } finally {
            if (toastId) {
                toast.dismiss(toastId);
            }
        }
    };

   return (
    <div
        className={`modal ${idSelected ? "modal-open" : ""} px-2 sm:px-4`}
    >
        <div className="w-full max-w-4xl max-h-[95vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">

            {/* HEADER */}
            <div className="relative px-4 sm:px-6 py-4 border-b">
                <button
                    className="absolute left-4 top-4 btn btn-circle btn-ghost btn-sm"
                    onClick={() => setEdit(false)}
                >
                    <ArrowUturnLeftIcon className="w-5 h-5" />
                </button>

                <h3 className="text-center font-semibold text-lg sm:text-xl">
                    {idSelected?.roles[0]?.name === "Instructor"
                        ? "Editar Instructor"
                        : "Editar Aprendiz"}
                </h3>
            </div>

            {/* BODY SCROLLABLE */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 bg-gray-50">

                {/* PERFIL */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                        <img
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
                            alt="profile pic"
                            src="/images/girl-pic.jpg"
                        />
                        <CameraIcon className="w-4 h-4 sm:w-5 sm:h-5 absolute bottom-0 right-0 text-primary cursor-pointer bg-white rounded-full p-1 shadow" />
                    </div>
                    <h1 className="font-semibold text-base sm:text-lg truncate">
                        {idSelected?.name}
                    </h1>
                </div>

                {/* FORM GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* INPUT BASE STYLE */}
                    {/** Puedes reutilizar esta clase en todos */}
                    {/* className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm bg-white focus:ring-2 focus:ring-primary focus:outline-none" */}

                    {/* NOMBRE */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Nombres</label>
                        <input
                            type="text"
                            className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm bg-white focus:ring-2 focus:ring-primary focus:outline-none"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>

                    {/* TIPO DOCUMENTO */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Tipo Documento</label>
                        <select
                            className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm bg-white focus:ring-2 focus:ring-primary focus:outline-none"
                            value={documento}
                            onChange={(e) => setDocumento(e.target.value)}
                        >
                            <option value="">Seleccione</option>
                            <option value="CC">Cédula</option>
                            <option value="TI">Tarjeta</option>
                        </select>
                    </div>

                    {/* NUMERO DOCUMENTO */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Número Documento</label>
                        <input
                            type="text"
                            className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm bg-white focus:ring-2 focus:ring-primary focus:outline-none"
                            value={numero_documento}
                            onChange={(e) => setNumeroDocumento(e.target.value)}
                        />
                    </div>

                    {/* EMAIL */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Correo</label>
                        <input
                            type="email"
                            className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm bg-white focus:ring-2 focus:ring-primary focus:outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* ESTADO */}
                    <div className="flex flex-col gap-1 md:col-span-2">
                        <label className="text-sm font-medium">Estado</label>
                        <select
                            className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm bg-white focus:ring-2 focus:ring-primary focus:outline-none"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                        >
                            <option value="">Seleccione estado</option>
                            <option value="pending">Pendiente</option>
                            <option value="active">Activo</option>
                        </select>
                    </div>

                    {/* FICHAS */}
                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-sm font-medium">Asignar Fichas</label>

                        <div className="border rounded-xl bg-white p-4 flex flex-col gap-4">

                            {/* TAGS */}
                            <div className="flex flex-wrap gap-2">
                                {selectedSheets.length > 0 ? (
                                    selectedSheets.map((sheetId) => {
                                        const sheet = sheets.find(s => s.id === sheetId);
                                        return (
                                            <div
                                                key={sheetId}
                                                className="bg-primary text-white px-3 py-1 rounded-full text-xs flex items-center gap-2 max-w-full"
                                            >
                                                <span className="truncate">
                                                    {sheet?.number}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleSheet(sheetId)}
                                                    className="font-bold"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <span className="text-xs text-gray-400">
                                        No hay fichas seleccionadas
                                    </span>
                                )}
                            </div>

                            {/* LISTA */}
                            <div className="max-h-44 overflow-y-auto border-t pt-3 flex flex-col gap-1">
                                {sheets.map((sheet) => {
                                    const isSelected = selectedSheets.includes(sheet.id);

                                    return (
                                        <div
                                            key={sheet.id}
                                            onClick={() => toggleSheet(sheet.id)}
                                            className={`cursor-pointer px-3 py-2 rounded-lg text-sm flex justify-between items-center transition
                                                ${isSelected
                                                    ? "bg-primary text-white"
                                                    : "hover:bg-gray-100"}
                                            `}
                                        >
                                            <span className="truncate">
                                                {sheet.number}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* FOOTER */}
            <div className="border-t px-4 sm:px-6 py-4 flex justify-end bg-white">
                <button
                    className="w-full sm:w-auto px-6 h-10 rounded-lg bg-primary text-white font-semibold hover:bg-white hover:text-primary border-2 border-primary transition"
                    onClick={async () => {
                        await UpdateInfo(
                            nombre,
                            documento,
                            numero_documento,
                            email,
                            estado,
                            idSelected.id,
                            selectedSheets
                        );
                    }}
                >
                    Guardar Cambios
                </button>
            </div>

        </div>
    </div>
);


}

export default UserEdit;

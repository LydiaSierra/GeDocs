import React, { useState, useContext } from "react";
import api from "@/lib/axios";
import { SheetsContext } from "@/context/SheetsContext/SheetsContext";

export default function CreateSheets() {
    const { fetchSheets } = useContext(SheetsContext);

    const [formData, setFormData] = useState({
        nombre: "",
        numeroFicha: "",
        director: "",
        contactoDirector: "",
        estado: "",
    });

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // ----------------------------------
    // Handle Change
    // ----------------------------------
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // ----------------------------------
    // Submit Handler
    // ----------------------------------
    const handleSubmit = async () => {
        setErrorMsg("");
        setSuccessMsg("");

        if (!formData.numeroFicha) {
            setErrorMsg("Debes ingresar un número de ficha.");
            return;
        }

        try {
            const res = await api.post("/api/sheets", {
                number: Number(formData.numeroFicha),
            });

            if (!res.data?.success) {
                setErrorMsg(res.data.message || "Error al crear la ficha.");
                return;
            }

            setSuccessMsg("Ficha creada con éxito.");
            await fetchSheets();

            // Reset form
            setFormData({
                nombre: "",
                numeroFicha: "",
                director: "",
                contactoDirector: "",
                estado: "",
            });
        } catch (error) {
            if (error.response?.status === 401) {
                setErrorMsg("La sesión ha expirado. Inicia sesión nuevamente.");
            } else {
                setErrorMsg("Error al comunicarse con el servidor.");
            }
            console.error("ERROR CREATE SHEET:", error);
        }
    };

    // ----------------------------------
    // JSX
    // ----------------------------------
    return (
        <div className="w-full bg-gray-100 p-8 rounded-lg">
            <h2 className="text-3xl font-semibold mb-6">Crear Ficha</h2>

            <div className="p-8 rounded-lg shadow-sm border bg-white">
                <div className="grid grid-cols-2 gap-6">
                    {/* Nombre */}
                    <InputGroup
                        label="Nombre"
                        name="nombre"
                        placeholder="Nombre del grupo"
                        value={formData.nombre}
                        onChange={handleChange}
                    />

                    {/* Número de ficha */}
                    <InputGroup
                        label="Número de Ficha"
                        name="numeroFicha"
                        placeholder="Ej: 3002085"
                        value={formData.numeroFicha}
                        onChange={handleChange}
                    />

                    {/* Director */}
                    <InputGroup
                        label="Director de Grupo"
                        name="director"
                        placeholder="Nombre del director"
                        value={formData.director}
                        onChange={handleChange}
                    />

                    {/* Contacto Director */}
                    <InputGroup
                        label="Contacto Director"
                        name="contactoDirector"
                        placeholder="Número de contacto"
                        value={formData.contactoDirector}
                        onChange={handleChange}
                    />

                    {/* Estado */}
                    <div className="col-span-2 flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1">
                            Estado
                        </label>
                        <select
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            className="select select-bordered w-full"
                        >
                            <option value="">Seleccione un estado</option>
                            <option>Sin Aprendices</option>
                            <option>Activa</option>
                            <option>Finalizada</option>
                            <option>Cancelada</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Mensajes */}
            {errorMsg && (
                <div className="mt-4 text-red-600 font-medium">{errorMsg}</div>
            )}

            {successMsg && (
                <div className="mt-4 text-green-600 font-medium">
                    {successMsg}
                </div>
            )}

            {/* Botón */}
            <div className="flex justify-center mt-8">
                <button
                    onClick={handleSubmit}
                    className="bg-green-600 text-white px-12 py-3 rounded-md text-lg hover:bg-green-700 transition shadow-md"
                >
                    Guardar
                </button>
            </div>
        </div>
    );
}

/* ----------------------------------
   Componente Reutilizable InputGroup
---------------------------------- */
function InputGroup({ label, name, value, placeholder, onChange }) {
    return (
        <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-1">{label}</label>
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="input input-bordered w-full"
            />
        </div>
    );
}

import React, { useState, useContext } from "react";
import api from "@/lib/axios";
import { SheetsContext } from "@/context/SheetsContext/SheetsContext";

export default function CreateSheets() {
    const { fetchSheets } = useContext(SheetsContext);

    const [formData, setFormData] = useState({
        numeroFicha: "",
    });

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // ---------------------------
    // Handle Change
    // ---------------------------
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // ---------------------------
    // Submit Handler
    // ---------------------------
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

            // Backend devuelve directamente la ficha creada, no usa "success"
            if (!res.data?.id) {
                setErrorMsg("Error al crear la ficha.");
                return;
            }

            setSuccessMsg("Ficha creada con éxito.");
            await fetchSheets();

            setFormData({ numeroFicha: "" });
        } catch (error) {
            if (error.response?.status === 401) {
                setErrorMsg("La sesión ha expirado. Inicia sesión nuevamente.");
            } else if (error.response?.status === 500) {
                setErrorMsg("Error interno del servidor. Verifica el backend.");
            } else {
                setErrorMsg("Error al comunicarse con el servidor.");
            }

            console.error("ERROR CREATE SHEET:", error);
        }
    };

    // ---------------------------
    // JSX
    // ---------------------------
    return (
        <div className="w-full bg-gray-100 p-8 rounded-lg">
            <h2 className="text-3xl font-semibold mb-6">Crear Ficha</h2>

            <div className="p-8 rounded-lg shadow-sm border bg-white">
                <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold mb-1">
                        Número de Ficha
                    </label>
                    <input
                        type="text"
                        name="numeroFicha"
                        placeholder="Ej: 3002085"
                        value={formData.numeroFicha}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                    />
                </div>
            </div>

            {errorMsg && (
                <div className="mt-4 text-red-600 font-medium">{errorMsg}</div>
            )}

            {successMsg && (
                <div className="mt-4 text-green-600 font-medium">
                    {successMsg}
                </div>
            )}

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

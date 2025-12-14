import React, { useState, useEffect, useContext } from "react";
import api from "@/lib/axios";
import { SheetsContext } from "@/context/SheetsContext/SheetsContext";

export default function EditSheets({ sheet }) {
    const { fetchSheets } = useContext(SheetsContext);

    const [formData, setFormData] = useState({
        numeroFicha: "",
        estado: "",
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (sheet) {
            setFormData({
                numeroFicha: sheet.number || "",
                estado: sheet.state || "",
            });
        }
    }, [sheet]);

    if (!sheet) return <p>Cargando...</p>;

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const saveChanges = async () => {
        try {
            const res = await api.put(`/api/sheets/${sheet.id}`, {
                number: Number(formData.numeroFicha),
                state: formData.estado,
            });

            if (!res.data?.success) {
                setErrorMessage("No se pudo actualizar la ficha");
                setTimeout(() => setErrorMessage(""), 3000);
                return;
            }

            await fetchSheets();

            setSuccessMessage("Ficha actualizada correctamente");
            setErrorMessage("");

            setTimeout(() => {
                setSuccessMessage("");
                document.getElementById("my_modal_4")?.close();
                document.getElementById("my_modal_3")?.close();
            }, 1200);
        } catch (error) {
            console.error(error);
            setErrorMessage("⚠ Error al actualizar la ficha");
            setTimeout(() => setErrorMessage(""), 3000);
        }
    };

    return (
        <div className="w-full bg-gray-100 rounded-lg p-4 sm:p-6 md:p-8">
           
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 md:mb-6 text-center md:text-left">
                Editar Ficha
            </h2>

            
            {successMessage && (
                <div className="mb-4 p-3 text-sm sm:text-base text-green-700 bg-green-100 border border-green-300 rounded-md">
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="mb-4 p-3 text-sm sm:text-base text-red-700 bg-red-100 border border-red-300 rounded-md">
                    {errorMessage}
                </div>
            )}

          
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-sm border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {/* Número */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1">
                            Número de Ficha
                        </label>
                        <input
                            type="text"
                            name="numeroFicha"
                            value={formData.numeroFicha}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>

                    {/* Estado */}
                    <div className="flex flex-col md:col-span-1">
                        <label className="text-gray-700 font-semibold mb-1">
                            Estado
                        </label>
                        <select
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
                        >
                    
                            <option>Activa</option>
                            <option>Finalizada</option>
                            <option>Cancelada</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* BOTÓN */}
            <div className="flex justify-center mt-6 sm:mt-8">
                <button
                    onClick={saveChanges}
                    className="
                        w-full sm:w-auto
                        bg-green-600 text-white
                        px-8 sm:px-12
                        py-3
                        rounded-md
                        text-base sm:text-lg
                        hover:bg-green-700
                        transition
                        shadow-md
                    "
                >
                    Guardar cambios
                </button>
            </div>
        </div>
    );
}

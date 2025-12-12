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
                setErrorMessage("❌ No se pudo actualizar la ficha");
                setTimeout(() => setErrorMessage(""), 3000);
                return;
            }

            await fetchSheets();

        
            setSuccessMessage("✔ Ficha actualizada correctamente");
            setErrorMessage("");

           
            setTimeout(() => {
                setSuccessMessage("");
                const modal = document.getElementById("my_modal_3");
                if (modal) modal.close();
            }, 1500);
        } catch (error) {
            console.error("Error al editar ficha:", error);

            setErrorMessage("⚠ Ocurrió un error al actualizar la ficha");
            setTimeout(() => setErrorMessage(""), 3000);
        }
    };

    return (
        <div className="w-full bg-gray-100 p-8 rounded-lg">
            <h2 className="text-3xl font-semibold mb-6">Editar Ficha</h2>

            {/* Mensaje de éxito */}
            {successMessage && (
                <div className="mb-4 p-3 text-green-700 bg-green-100 border border-green-300 rounded-md animate-fadeIn">
                    {successMessage}
                </div>
            )}

            {/* Mensaje de error */}
            {errorMessage && (
                <div className="mb-4 p-3 text-red-700 bg-red-100 border border-red-300 rounded-md animate-fadeIn">
                    {errorMessage}
                </div>
            )}

            <div className="p-8 rounded-lg shadow-sm border">
                <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1">
                            Número de Ficha
                        </label>
                        <input
                            type="text"
                            name="numeroFicha"
                            value={formData.numeroFicha}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-md bg-white shadow-sm"
                        />
                    </div>

                    <div className="col-span-2 flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1">
                            Estado
                        </label>
                        <select
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-md bg-white shadow-sm"
                        >
                            <option>Sin Aprendices</option>
                            <option>Activa</option>
                            <option>Finalizada</option>
                            <option>Cancelada</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex justify-center mt-8">
                <button
                    onClick={saveChanges}
                    className="bg-green-600 text-white px-12 py-3 rounded-md text-lg hover:bg-green-700 transition shadow-md"
                >
                    Guardar
                </button>
            </div>
        </div>
    );
}

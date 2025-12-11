import React, { useState, useEffect, useContext } from "react";
import api from "@/lib/axios";
import { SheetsContext } from "@/context/SheetsContext/SheetsContext";

export default function EditSheets({ sheet }) {
    const { fetchSheets } = useContext(SheetsContext);

    // Cargar datos iniciales
    const [formData, setFormData] = useState({
        nombre: "",
        numeroFicha: "",
        director: "",
        contactoDirector: "",
        estado: "",
    });

    useEffect(() => {
        if (sheet) {
            setFormData({
                nombre: sheet.name,
                numeroFicha: sheet.number,
                director: sheet.director,
                contactoDirector: sheet.directorPhone,
                estado: sheet.state,
            });
        }
    }, [sheet]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // GUARDAR CAMBIOS EN LA API
    const saveChanges = async () => {
        try {
            const res = await api.put(`/sheets/${sheet.id}`, {
                name: formData.nombre,
                number: formData.numeroFicha,
                director: formData.director,
                directorPhone: formData.contactoDirector,
                state: formData.estado,
            });

            if (!res.data.success) {
                console.log("Error editando la ficha");
                return;
            }

            // Refrescar la tabla
            await fetchSheets();

            // Cerrar modal
            document.getElementById("my_modal_3").close();
        } catch (e) {
            console.log("Error:", e);
        }
    };

    return (
        <div className="w-full bg-gray-100 p-8 rounded-lg">
            <h2 className="text-3xl font-semibold mb-6">Editar Ficha</h2>

            <div className="p-8 rounded-lg shadow-sm border">
                <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1">
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-md bg-white shadow-sm"
                        />
                    </div>

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

                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1">
                            Director de Grupo
                        </label>
                        <input
                            type="text"
                            name="director"
                            value={formData.director}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-md bg-white shadow-sm"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1">
                            Contacto Director
                        </label>
                        <input
                            type="text"
                            name="contactoDirector"
                            value={formData.contactoDirector}
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

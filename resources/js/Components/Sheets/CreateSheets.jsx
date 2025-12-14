import React, { useState } from "react";

export default function EditSheets() {
    const [formData, setFormData] = useState({
        nombre: "",
        numeroFicha: "",
        director: "",
        contactoDirector: "",
        estado: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="w-full bg-gray-100 p-8 rounded-lg">

            {/* Título */}
            <h2 className="text-3xl font-semibold mb-6">Crear Ficha</h2>

            {/* Contenedor del formulario */}
            <div className="p-8 rounded-lg shadow-sm border bg-white">

                <div className="grid grid-cols-2 gap-6">

                    {/* Nombre */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Nombre del grupo"
                            className="w-full p-3 border rounded-md bg-white shadow-sm"
                        />
                    </div>

                    {/* Número de ficha */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1">Número de Ficha</label>
                        <input
                            type="text"
                            name="numeroFicha"
                            value={formData.numeroFicha}
                            onChange={handleChange}
                            placeholder="Ej: 3002085"
                            className="w-full p-3 border rounded-md bg-white shadow-sm"
                        />
                    </div>

                    {/* Director */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1">Director de Grupo</label>
                        <input
                            type="text"
                            name="director"
                            value={formData.director}
                            onChange={handleChange}
                            placeholder="Nombre del director"
                            className="w-full p-3 border rounded-md bg-white shadow-sm"
                        />
                    </div>

                    {/* Contacto Director */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1">Contacto Director</label>
                        <input
                            type="text"
                            name="contactoDirector"
                            value={formData.contactoDirector}
                            onChange={handleChange}
                            placeholder="Número de contacto"
                            className="w-full p-3 border rounded-md bg-white shadow-sm"
                        />
                    </div>

                    {/* Estado */}
                    <div className="col-span-2 flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1">Estado</label>
                        <select
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-md bg-white shadow-sm"
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

            {/* Botón Guardar */}
            <div className="flex justify-center mt-8">
                <button className="bg-green-600 text-white px-12 py-3 rounded-md text-lg hover:bg-green-700 transition shadow-md">
                    Guardar
                </button>
            </div>
        </div>
    );
}

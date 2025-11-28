import React, { useState } from "react";

export default function EditSheets() {
    const [formData, setFormData] = useState({
        nombre: "Grupo 1",
        numeroFicha: "3002085",
        director: "Oscar Sanchez",
        contactoDirector: "3201234567",
        estado: "Sin Aprendices",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="w-full bg-gray-100 p-8 rounded-lg">

         
            <h2 className="text-3xl font-semibold mb-6">Editar Ficha</h2>

          
            <div className=" p-8 rounded-lg shadow-sm border">

               
                <div className="grid grid-cols-2 gap-6">

               
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-md bg-white shadow-sm"
                        />
                    </div>

                  
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1">Número de Ficha</label>
                        <input
                            type="text"
                            name="numeroFicha"
                            value={formData.numeroFicha}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-md bg-white shadow-sm"
                        />
                    </div>

                    
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1">Director de Grupo</label>
                        <input
                            type="text"
                            name="director"
                            value={formData.director}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-md bg-white shadow-sm"
                        />
                    </div>

             
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1">Contacto Director</label>
                        <input
                            type="text"
                            name="contactoDirector"
                            value={formData.contactoDirector}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-md bg-white shadow-sm"
                        />
                    </div>

                    
                    <div className="col-span-2 flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1">Estado</label>
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
                <button className="bg-green-600 text-white px-12 py-3 rounded-md text-lg hover:bg-green-700 transition shadow-md">
                    Guardar
                </button>
            </div>
        </div>
    );
}

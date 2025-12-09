import React from "react";
import EditSheets from "@/Components/Sheets/EditSheets.jsx"
export default function ViewSheets() {
     const openEditModal = () => {
        document.getElementById("my_modal_4").showModal();
    };
    return (
        <div className="w-full bg-gray-100 p-6 rounded-lg ">
             {/* MODAL */}
                       <dialog id="my_modal_4" className="modal">
                            <div className="modal-box max-w-5xl w-[90%] p-8">
            
                                <form method="dialog">
                                    {/* Botón cerrar */}
                                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                        ✕
                                    </button>
                                </form>
                                <EditSheets/>
                            </div>
                        </dialog>

            {/* Título */}
            <h2 className="text-2xl font-semibold mb-4">Detalles de Ficha</h2>

            {/* Tarjeta */}
            <div className="bg-gray-200 p-6 rounded-lg">

                {/* Grid de información */}
                <div className="grid grid-cols-2 gap-6">

                    <div>
                        <p className="text-gray-700 font-medium">Nombre</p>
                        <p className="font-semibold">Grupo 1</p>
                    </div>

                    <div>
                        <p className="text-gray-700 font-medium">Numero Ficha</p>
                        <p className="font-semibold">3002085</p>
                    </div>

                    <div>
                        <p className="text-gray-700 font-medium">Director de Grupo</p>
                        <p className="font-semibold">Oscar Sanchez</p>
                    </div>

                    <div>
                        <p className="text-gray-700 font-medium">Contacto Director</p>
                        <p className="font-semibold">3228145621</p>
                    </div>

                    <div>
                        <p className="text-gray-700 font-medium">Estado</p>
                        <p className="font-semibold">Activa</p>
                    </div>

                    <div>
                        <p className="text-gray-700 font-medium">Alumnos inscritos</p>
                        <p className="font-semibold">20</p>
                    </div>

                </div>

                {/* Instructores */}
                <div className="mt-6">
                    <p className="text-gray-700 font-medium">Instructores asignados</p>
                    <p className="font-semibold">Oscar Sanchez</p>
                    <p className="font-semibold">Oscar Sanchez</p>
                </div>
            </div>

            {/* Botones */}
            <div className="flex justify-center gap-6 mt-6">
                <button onClick={openEditModal}  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition cursor-pointer">
                    Editar
                </button>

                <button className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition cursor-pointer">
                    Borrar
                </button>
            </div>
        </div>
    );
}

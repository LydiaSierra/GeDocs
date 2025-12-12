import React from "react";
import EditSheets from "@/Components/Sheets/EditSheets.jsx";

export default function ViewSheets({ sheet }) {
    const openEditModal = () => {
        document.getElementById("my_modal_4").showModal();
    };

    return (
        <div className="w-full bg-gray-100 p-6 rounded-lg">
            {/* MODAL */}
            <dialog id="my_modal_4" className="modal">
                <div className="modal-box max-w-5xl w-[90%] p-8">
                    {/* Botón cerrar */}
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                            ✕
                        </button>
                    </form>

                    {/* EDIT FORM */}
                    <EditSheets sheet={sheet} />
                </div>
            </dialog>

            {/* Título */}
            <h2 className="text-2xl font-semibold mb-4">Detalles de Ficha</h2>

            {/* Tarjeta */}
            <div className="bg-gray-200 p-6 rounded-lg">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-gray-700 font-medium">
                            Número Ficha
                        </p>
                        <p className="font-semibold">{sheet?.number}</p>
                    </div>

                    <div>
                        <p className="text-gray-700 font-medium">Estado</p>
                        <p className="font-semibold">{sheet?.state}</p>
                    </div>
                </div>

                {/* Instructores */}
                <div className="mt-6">
                    <p className="text-gray-700 font-medium">
                        Instructores asignados
                    </p>
                    {(sheet?.instructors ?? []).map((i, idx) => (
                        <p className="font-semibold" key={idx}>
                            {i}
                        </p>
                    ))}
                </div>
            </div>

            {/* Botones */}
            <div className="flex justify-center gap-6 mt-6">
                <button
                    onClick={openEditModal}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition cursor-pointer"
                >
                    Editar
                </button>

                <button className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition cursor-pointer">
                    Borrar
                </button>
            </div>
        </div>
    );
}

import React, { useState, useContext } from "react";
import EditSheets from "@/Components/Sheets/EditSheets.jsx";
import DeleteSheets from "./DeleteSheets";
import { SheetsContext } from "@/context/SheetsContext/SheetsContext";

export default function ViewSheets({ sheet }) {
    const { deleteSheet } = useContext(SheetsContext);
    const [sheetToDelete, setSheetToDelete] = useState(null);

    const openEditModal = () => {
        document.getElementById("my_modal_3")?.close();

        setTimeout(() => {
            document.getElementById("my_modal_4")?.showModal();
        }, 100);
    };

    const openDeleteModal = () => {
        document.getElementById("my_modal_3")?.close();

        setSheetToDelete(sheet);
        setTimeout(() => {
            document.getElementById("delete_modal")?.showModal();
        }, 100);
    };

    return (
        <div className="w-full bg-gray-100 p-6 rounded-lg">
            <dialog id="my_modal_4" className="modal">
                <div className="modal-box max-w-5xl w-[90%] p-8">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                            ✕
                        </button>
                    </form>

                    <EditSheets sheet={sheet} />
                </div>
            </dialog>

            <DeleteSheets
                sheetToDelete={sheetToDelete}
                deleteSheet={deleteSheet}
            />

            <h2 className="text-2xl font-semibold mb-4">Detalles de Ficha</h2>

            <div className="bg-gray-100 p-6 rounded-lg">
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
            </div>

            <div className="flex justify-center gap-6 mt-6">
                <button
                    onClick={openEditModal}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
                >
                    Editar
                </button>

                <button
                    onClick={openDeleteModal}
                    className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition"
                >
                    Borrar
                </button>
            </div>
        </div>
    );
}

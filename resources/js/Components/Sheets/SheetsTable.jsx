import React, { useContext, useState } from "react";
import EditSheets from "./EditSheets";
import { SheetsContext } from "@/context/SheetsContext/SheetsContext";
import ViewSheets from "./ViewSheets";
import DeleteSheets from "./DeleteSheets"; //

export default function SheetsTable() {
    const { sheets, deleteSheet } = useContext(SheetsContext);

    const [hoveredRow, setHoveredRow] = useState(null);

    // Ficha seleccionada para ver/editar
    const [selectedSheet, setSelectedSheet] = useState(null);

    // Ficha seleccionada para eliminar
    const [sheetToDelete, setSheetToDelete] = useState(null);

    const openEditModal = (item) => {
        setSelectedSheet(item);
        setTimeout(() => {
            document.getElementById("my_modal_3").showModal();
        }, 10);
    };

    const openDeleteModal = (item) => {
        setSheetToDelete(item);
        document.getElementById("delete_modal").showModal();
    };

    return (
        <div className="w-full overflow-hidden">
            <dialog id="my_modal_3" className="modal">
                <div className="modal-box max-w-5xl w-[90%] p-5">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                            ✕
                        </button>
                    </form>

                    {selectedSheet ? (
                        <ViewSheets sheet={selectedSheet} />
                    ) : (
                        <p>Cargando ficha...</p>
                    )}
                </div>
            </dialog>

            {/* MODAL DE ELIMINAR */}
            <DeleteSheets
                sheetToDelete={sheetToDelete}
                deleteSheet={deleteSheet}
            />

            {/* TABLA */}
            <div className="max-h-[1200px] overflow-y-auto overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-500 text-white text-sm font-semibold">
                        <tr>
                            <th className="py-3 text-left px-5">Id</th>
                            <th className="py-3 text-left">Ficha</th>
                            <th className="py-3 text-left">Alumnos</th>
                            <th className="py-3 text-left rounded-r-lg">
                                Estado
                            </th>
                        </tr>
                    </thead>

                    <tbody className="border-separate border-spacing-y-2">
                        {sheets.map((item, i) => (
                            <tr
                                key={item.id}
                                className="odd:bg-gray-100 even:bg-gray-200 hover:bg-senaLightBlue"
                                onMouseEnter={() => setHoveredRow(i)}
                                onMouseLeave={() => setHoveredRow(null)}
                            >
                                <td
                                    onClick={() => openEditModal(item)}
                                    className="py-3 text-left truncate px-5 cursor-pointer"
                                >
                                    {item.id}
                                </td>

                                <td className="py-3 text-left">
                                    {item.number}
                                </td>

                                <td className="py-3 text-left">20</td>

                                <td className="py-3 text-left rounded-r-lg">
                                    {item.state}
                                </td>

                                <td className="py-3 text-left rounded-r-lg relative">
                                    {hoveredRow === i && (
                                        <div className="dropdown dropdown-end absolute right-0 -mt-5">
                                            <div
                                                tabIndex={0}
                                                role="button"
                                                className="btn btn-sm m-1 text-2xl"
                                            >
                                                ...
                                            </div>

                                            <ul className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm">
                                                <li>
                                                    <button
                                                        onClick={() =>
                                                            openEditModal(item)
                                                        }
                                                    >
                                                        Ver
                                                    </button>
                                                </li>

                                                <li>
                                                    <button
                                                        className="text-red-600"
                                                        onClick={() =>
                                                            openDeleteModal(
                                                                item
                                                            )
                                                        }
                                                    >
                                                        Eliminar
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

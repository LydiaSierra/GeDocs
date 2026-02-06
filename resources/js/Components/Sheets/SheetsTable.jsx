import React, { useContext, useState } from "react";
import { SheetsContext } from "@/context/SheetsContext/SheetsContext";
import ViewSheets from "./ViewSheets";
import DeleteSheets from "./DeleteSheets";

export default function SheetsTable({ sheets = [] }) {
    const { deleteSheet } = useContext(SheetsContext);

    const [hoveredRow, setHoveredRow] = useState(null);
    const [selectedSheet, setSelectedSheet] = useState(null);
    const [sheetToDelete, setSheetToDelete] = useState(null);

    const isEmpty = !sheets || sheets.length === 0;

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
        <div className="w-full">
            {/* MODAL VER */}
            <dialog id="my_modal_3" className="modal">
                <div className="modal-box max-w-5xl p-4 sm:p-6">
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

            <DeleteSheets
                sheetToDelete={sheetToDelete}
                deleteSheet={deleteSheet}
            />

            <div
                className="
                    md:hidden
                    space-y-3
                    h-[calc(100vh-220px)]
                    overflow-y-auto
                    overflow-x-hidden
                    px-1
                    overscroll-contain
                "
            >
                {isEmpty ? (
                    <div className="text-center py-10 text-gray-500">
                        <p className="text-lg font-semibold">
                            No hay fichas existentes
                        </p>
                    </div>
                ) : (
                    sheets.map((item) => (
                        <div
                            key={item.id}
                            className="
                                bg-gray-100
                                border border-gray-200
                                rounded-lg
                                p-4
                                shadow-sm
                                cursor-pointer
                            "
                            onClick={() => openEditModal(item)}
                        >
                            <div className="flex justify-between items-center">
                                <p className="font-semibold">
                                    Ficha #{item.number}
                                </p>
                                <span className="text-sm text-gray-500">
                                    {item.state}
                                </span>
                            </div>

                            <p className="text-sm mt-2 text-gray-600">
                                ID: {item.id}
                            </p>

                            <div className="flex gap-3 mt-4">
                                <button
                                    className="flex-1 bg-primary text-white py-2 rounded-md"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openEditModal(item);
                                    }}
                                >
                                    Ver
                                </button>

                                <button
                                    className="
                                        flex-1
                                        border border-red-500
                                        text-red-500
                                        bg-white
                                        py-2
                                        rounded-md
                                        hover:bg-red-100
                                        transition
                                    "
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openDeleteModal(item);
                                    }}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* ===== DESKTOP ===== */}
            <div className="hidden md:block">
                <div className="rounded-lg overflow-hidden border border-gray-200 bg-white">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-500 text-white text-sm font-semibold">
                            <tr>
                                <th className="py-3 px-5 text-left">Id</th>
                                <th className="py-3 text-left">Ficha</th>
                                <th className="py-3 text-left">Alumnos</th>
                                <th className="py-3 text-left">Estado</th>
                                <th className="py-3 text-left"></th>
                            </tr>
                        </thead>

                        <tbody className="border-separate border-spacing-y-2">
                            {isEmpty ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="py-8 text-center text-gray-500"
                                    >
                                        No hay fichas existentes
                                    </td>
                                </tr>
                            ) : (
                                sheets.map((item, i) => (
                                    <tr
                                        key={item.id}
                                        className="odd:bg-gray-100 even:bg-gray-200 hover:bg-senaLightBlue"
                                        onMouseEnter={() => setHoveredRow(i)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                    >
                                        <td
                                            onClick={() => openEditModal(item)}
                                            className="py-3 px-5 cursor-pointer"
                                        >
                                            {item.id}
                                        </td>
                                        <td className="py-3">{item.number}</td>
                                        <td className="py-3">20</td>
                                        <td className="py-3">{item.state}</td>

                                        <td className="relative overflow-visible">
                                            {hoveredRow === i && (
                                                <div className="dropdown dropdown-end absolute right-2 top-1/2 -translate-y-1/2 z-9999">
                                                    <div
                                                        tabIndex={0}
                                                        role="button"
                                                        className="btn btn-sm"
                                                    >
                                                        ...
                                                    </div>

                                                    <ul className="dropdown-content menu bg-base-100 rounded-lg w-40 p-2 shadow-lg">
                                                        <li>
                                                            <button
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        item
                                                                    )
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

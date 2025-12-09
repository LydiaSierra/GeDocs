import React, { useState } from "react";
import { UserGroupIcon } from "@heroicons/react/24/solid";
import ViewSheets from "./ViewSheets";

export default function ChipsTable() {
    const [hoveredRow, setHoveredRow] = useState(null);

    const openEditModal = () => {
        document.getElementById("my_modal_3").showModal();
    };

    return (
        <div className="w-full overflow-hidden">

            {/* MODAL */}
           <dialog id="my_modal_3" className="modal">
                <div className="modal-box max-w-5xl w-[90%] p-8">

                    <form method="dialog">
                        {/* Botón cerrar */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                            ✕
                        </button>
                    </form>
                    <ViewSheets/>
                </div>
            </dialog>
            


            {/* CONTENEDOR SCROLLEABLE */}
            <div className="max-h-[600px] overflow-y-auto overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-500 text-white text-sm font-semibold">
                        <tr>
                            <th className="py-3 text-left px-5">Nombre</th>
                            <th className="py-3 text-left">Ficha</th>
                            <th className="py-3 text-left">Director</th>
                            <th className="py-3 text-left">Alumnos</th>
                            <th className="py-3 text-left rounded-r-lg">Estado</th>
                        </tr>
                    </thead>

                    <tbody className="border-separate border-spacing-y-2">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <tr
                                key={i}
                                className="odd:bg-gray-100 even:bg-gray-200 hover:bg-senaLightBlue"
                                onMouseEnter={() => setHoveredRow(i)}
                                onMouseLeave={() => setHoveredRow(null)}
                            >
                                <td onClick={openEditModal} className="py-3 text-left truncate px-5 cursor-pointer">ADSO</td>
                                <td className="py-3 text-left">3002085</td>
                                <td className="py-3 text-left truncate">Oscar</td>
                                <td className="py-3 text-left">20</td>
                                <th className="py-3 text-left rounded-r-lg">Activa</th>

                                {/* Última columna con dropdown */}
                                <td className="py-3 text-left rounded-r-lg relative">
                                    {hoveredRow === i && (
                                        <div className="dropdown dropdown-end absolute right-0 -mt-5">
                                            <div
                                                tabIndex={0}
                                                role="button"
                                                className="btn btn-sm m-1 text-2xl justify-center"
                                            >
                                                ...
                                            </div>

                                            <ul
                                                tabIndex="-1"
                                                className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm"
                                            >
                                                <li>
                                                    <button onClick={openEditModal}>
                                                        Ver
                                                    </button>
                                                </li>

                                                <li><a>Eliminar</a></li>
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

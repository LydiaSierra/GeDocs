import React from "react";
import { UserGroupIcon } from "@heroicons/react/24/solid";

export default function ChipsTable() {
    return (
        <div className="w-full overflow-hidden">

            {/* ENCABEZADO FIJO */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-500 text-white text-sm font-semibold">
                        <tr>
                            <th className="rounded-l-lg py-3"></th> {/* Checkbox */}
                            <th className="py-3 text-left">Nombre</th>
                            <th className="py-3 text-left">Ficha</th>
                            <th className="py-3 text-left">Director</th>
                            <th className="py-3 text-left">Alumnos</th>
                            <th className="py-3 text-left rounded-r-lg">Estado</th>
                        </tr>                    
                        </thead>
                        <tbody className="max-h-[600px] overflow-y-auto overflow-x-auto">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <tr
                                key={i}
                                className="odd:bg-gray-100 even:bg-gray-200 hover:bg-senaLightBlue"
                            >
                                {/* Checkbox */}
                                <td className="py-3 rounded-l-lg">
                                    <input type="checkbox" className="checkbox ml-3" />
                                </td>

                                {/* Datos */}
                                <td className="py-3 text-left truncate">ADSO</td>
                                <td className="py-3 text-left">3002085</td>
                                <td className="py-3 text-left truncate">Oscar</td>
                                <td className="py-3 text-left">20</td>
                                <td className="py-3 text-left rounded-r-lg">Activo</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

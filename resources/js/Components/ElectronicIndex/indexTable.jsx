import { useState } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

export default function IndexTable() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    const toggleMenu = (event) => {
        event.stopPropagation();

        const rect = event.currentTarget.getBoundingClientRect();
        const menuWidth = 160;
        const viewportPadding = 8;
        const left = Math.min(
            Math.max(rect.right - menuWidth, viewportPadding),
            window.innerWidth - menuWidth - viewportPadding,
        );

        setMenuPosition({
            top: rect.bottom + 8,
            left,
        });

        setMenuOpen((prev) => !prev);
    };

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full table-fixed md:table-auto border-collapse pb-3">
                <thead className="sticky top-0 z-10 bg-white border-b border-gray-300">
                    <tr className="text-gray-600 uppercase text-[10px] md:text-sm">
                        <th className="py-4 px-2 md:px-4 text-left font-bold w-[65%] md:w-auto">
                            Radicado
                        </th>
                        <th className="hidden lg:table-cell px-4 text-left font-bold">
                            Fecha Creacion
                        </th>
                        <th className="px-2 md:px-4 text-center md:text-left font-bold w-[35%] md:w-auto">
                            Fecha Incorporacion
                        </th>
                        <th className="hidden sm:table-cell px-4 text-left font-bold">
                            Numero de gestion
                        </th>
                        <th className="hidden sm:table-cell px-4 text-left font-bold">
                            Dependencia
                        </th>
                        <th className="hidden sm:table-cell px-4 text-left font-bold">
                            Hash
                        </th>
                        <th className="hidden sm:table-cell px-4 text-left font-bold"></th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    <tr className="cursor-pointer border-b border-gray-100 transition-colors bg-white hover:bg-primary/5 select-none">
                        <td className="py-4 px-2 md:px-4">
                            <div className="flex items-center text-sm gap-2 font-semibold md:gap-3">
                                2024-0001
                            </div>
                        </td>
                        <td className="hidden lg:table-cell px-4 text-left text-sm text-gray-500">
                            2024-06-01
                        </td>
                        <td className="px-2 md:px-4 text-center md:text-left text-sm text-gray-500">
                            2024-06-03
                        </td>
                        <td className="hidden sm:table-cell px-4 text-left text-sm text-gray-500">
                            12345
                        </td>
                        <td className="hidden sm:table-cell px-4 text-left text-sm text-gray-500">
                            Archivo Central
                        </td>
                        <td className="hidden sm:table-cell px-4 text-left text-sm text-gray-500">
                            A1B2C3D4
                        </td>
                        <td className="hidden sm:table-cell px-4 text-right">
                            <button
                                type="button"
                                className="p-1 rounded-md hover:bg-gray-100 transition-colors inline-flex"
                                onClick={toggleMenu}
                            >
                                <EllipsisVerticalIcon className="size-5 text-gray-400" />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            {menuOpen && (
                <>
                    <button
                        type="button"
                        className="fixed inset-0 z-40 cursor-default"
                        onClick={() => setMenuOpen(false)}
                        aria-label="Cerrar menú"
                    />
                    <ul
                        className="fixed z-50 menu bg-white rounded-lg w-40 p-1 shadow-lg border border-gray-100"
                        style={{
                            top: menuPosition.top,
                            left: menuPosition.left,
                        }}
                    >
                        <li>
                            <button
                                className="text-sm"
                                onClick={() => setMenuOpen(false)}
                            >
                                Ir al archivo
                            </button>
                        </li>
                        <li>
                            <button
                                className="text-sm"
                                onClick={() => setMenuOpen(false)}
                            >
                                Desacargar
                            </button>
                        </li>
                        <li>
                            <button
                                className="text-sm text-red-600"
                                onClick={() => setMenuOpen(false)}
                            >
                                Eliminar
                            </button>
                        </li>
                    </ul>
                </>
            )}
        </div>
    );
}

import React from "react";
import {
    BarsArrowUpIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import SheetsTable from "./SheetsTable";
import CreateSheets from "./CreateSheets"
export default function TableSheets() {
    const openEditModal = () => {
        document.getElementById("my_modal_2").showModal();
    };
    return (
        <div className="w-full max-w-none flex flex-col md:ml-1 p-3 bg-white rounded-lg h-full">
            <dialog id="my_modal_2" className="modal">
                            <div className="modal-box max-w-5xl w-[90%] p-8">
            
                                <form method="dialog">
                                    {/* Botón cerrar */}
                                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                        ✕
                                    </button>
                                </form>
                                <CreateSheets/>
                            </div>
                        </dialog>

            {/* Título */}
            <h2 className="font-bold text-2xl mb-3 text-left">
                Lista de Fichas
            </h2>

            {/* Barra de búsqueda */}
            <div id="inbox-search" className="flex gap-2 w-full">
                <div className="flex items-center  px-2 rounded-md flex-1">
                    <input
                        placeholder="Buscar"
                        type="text"
                        className="input bg-gray-200 border-none focus:outline-none shadow-none w-100"
                    />
                    <MagnifyingGlassIcon className="size-5 mr-2 shrink-0 bg-gray-200 h-9 w-9 -ml-10 z-1" />
                    <button className="p-2 bg-gray-200 rounded-md shrink-0">
                        <FunnelIcon className="size-5" />
                    </button>
                
                </div>
                <button onClick={openEditModal} className="p-2 bg-green-600 rounded-md shrink-0 text-white cursor-pointer">
                        Nueva ficha
                </button>
            </div>

        

            {/* TABLA - ahora ocupando TODA la pantalla disponible */}
            <div className="flex-1 w-full  border rounded-lg overflow-hidden mt-10">
                <SheetsTable />
            </div>
        </div>
    );
}

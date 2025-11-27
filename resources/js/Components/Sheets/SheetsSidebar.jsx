import React from "react";
import {
    BarsArrowUpIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import SheetsTable from "./SheetsTable";

export default function ChipsSidebar() {
    return (
        <div className="w-full max-w-none flex flex-col md:ml-1 p-3 bg-white rounded-lg h-full">


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
            </div>

            {/* Categorías */}
            <div id="inbox-categories" className="flex my-3 w-full items-center">
                <form className="flex gap-2 w-full overflow-x-auto p-1">
                    <input className="btn rounded-xl checked:bg-senaGreen border-none py-2 px-4 whitespace-nowrap" type="checkbox" aria-label="Preguntas" />
                    <input className="btn rounded-xl checked:bg-senaGreen border-none py-2 px-4 whitespace-nowrap" type="checkbox" aria-label="Quejas" />
                    <input className="btn rounded-xl checked:bg-senaGreen border-none py-2 px-4 whitespace-nowrap" type="checkbox" aria-label="Reclamos" />
                    <input className="btn rounded-xl checked:bg-senaGreen border-none py-2 px-4 whitespace-nowrap" type="checkbox" aria-label="Sugerencias" />
                    <button className="p-3 bg-gray-100 rounded-md ml-2 shrink-0">
                        <BarsArrowUpIcon className="size-5" />
                    </button>
                </form>
            </div>

            {/* TABLA - ahora ocupando TODA la pantalla disponible */}
            <div className="flex-1 w-full  border rounded-lg overflow-hidden">
                
                <SheetsTable />
            </div>
        </div>
    );
}

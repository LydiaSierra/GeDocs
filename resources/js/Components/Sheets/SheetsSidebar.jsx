import React from "react";
import {
    BarsArrowUpIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import SheetsTable from "./SheetsTable";
import CreateSheets from "./CreateSheets";
export default function TableSheets() {
    const openEditModal = () => {
        document.getElementById("my_modal_2").showModal();
    };
    return (
        <div className="w-full max-w-none flex flex-col p-3 bg-white rounded-lg min-h-full">
            {/* MODAL */}
            <dialog id="my_modal_2" className="modal">
                <div className="modal-box max-w-5xl w-[95%] sm:w-[90%] p-6 sm:p-8">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                            ✕
                        </button>
                    </form>
                    <CreateSheets />
                </div>
            </dialog>

            
            <h2 className="font-bold text-xl sm:text-2xl mb-3 text-left">
                Lista de Fichas
            </h2>

            
            <div
                id="inbox-search"
                className="flex flex-col sm:flex-row gap-3 w-full"
            >
                <div className="flex items-center px-2 rounded-md flex-1">
                    <input
                        placeholder="Buscar"
                        type="text"
                        className="input bg-gray-200 border-none focus:outline-none shadow-none w-full"
                    />

                    <MagnifyingGlassIcon className="size-5 mr-2 shrink-0 bg-gray-200 h-9 w-9 -ml-10 z-10 pointer-events-none" />

                    <button className="p-2 bg-gray-200 rounded-md shrink-0 ml-2">
                        <FunnelIcon className="size-5" />
                    </button>
                </div>

                <button
                    onClick={openEditModal}
                    className="p-2 bg-green-600 rounded-md text-white cursor-pointer w-full sm:w-auto"
                >
                    Nueva ficha
                </button>
            </div>

            
            <div className="w-full border rounded-lg mt-6 overflow-visible">
                <SheetsTable />
            </div>
        </div>
    );
}

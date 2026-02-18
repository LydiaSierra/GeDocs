import React, { useState, useContext, useMemo } from "react";
import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import SheetsTable from "./SheetsTable";
import CreateSheets from "./CreateSheets";
import { SheetsContext } from "@/context/SheetsContext/SheetsContext";
import EmptyState from "../EmptyState";

export default function TableSheets() {
    const { sheets } = useContext(SheetsContext);
    const [search, setSearch] = useState("");

    const openEditModal = () => {
        document.getElementById("my_modal_2")?.showModal();
    };

    const filteredSheets = useMemo(() => {
        if (!search.trim()) return sheets;

        const term = search.toLowerCase();

        return sheets.filter(
            (sheet) =>
                sheet.number.toString().includes(term) ||
                sheet.state.toLowerCase().includes(term) ||
                sheet.id.toString().includes(term)
        );
    }, [search, sheets]);

    return (
        <div className="w-full flex flex-col p-3 bg-white rounded-lg min-h-90% mt-4">
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

            <h2 className="font-bold text-xl sm:text-2xl mb-3">
                Lista de Fichas
            </h2>

            {/* SEARCH */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
                <div className="flex items-center flex-1 bg-gray-200 px-3 py-1 rounded-md gap-2">
                    <input
                        placeholder="Buscar por número o estado"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="
                        input
                            bg-gray-200
                            border-none
                            focus:outline-none
                            shadow-none
                            text-sm
                            min-w-0
                        "
                    />

                    <MagnifyingGlassIcon
                        className="w-4 h-4 shrink-0 text-[#404142] cursor-pointer"
                        onClick={() => {
                            searchUser(inputSearch, filterSelected);
                        }}
                    />
                </div>


                <button
                    onClick={openEditModal}
                    className="p-2 bg-primary rounded-md text-white w-full sm:w-auto"
                >
                    Nueva ficha
                </button>
            </div>

            <div className="w-full border rounded-lg mt-6 overflow-visible h-full relative">
                {filteredSheets.length > 0 ?
                    <SheetsTable sheets={filteredSheets} />
                    :
                    <EmptyState text={"Aún no hay fichas creadas"}/>
                }
            </div>
        </div>
    );
}

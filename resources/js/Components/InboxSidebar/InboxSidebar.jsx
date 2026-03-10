import {
    BarsArrowUpIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import InboxMailCard from "@/Components/InboxMailCard/InboxMailCard";
import { useContext, useEffect, useState } from "react";
import { MailContext } from "@/context/MailContext/MailContext.jsx";

export default function InboxSidebar() {
    const {
        filteredMailCards,
        selectedMail,
        loading,
        toggleFilter,
        filters,
        searchTerm,
        setSearchTerm,
    } = useContext(MailContext);

    const categories = [
        { label: "Peticiones", value: "Peticion" },
        { label: "Quejas", value: "Queja" },
        { label: "Reclamos", value: "Reclamo" },
        { label: "Sugerencias", value: "Sugerencia" },
    ];

    const currentMonthYear = new Intl.DateTimeFormat("es-ES", {
        month: "long",
        year: "numeric",
    }).format(new Date());

    return (
        <div
            className={`
        w-full
        md:min-w-[450px]
        lg:w-1/3
        bg-white
        flex flex-col
        rounded-lg
        h-full
        md:ml-1
        md:p-3
        transition-all duration-300 ease-in-out
        ${selectedMail ? "hidden lg:flex" : "flex"}
    `}
        >
            <div className="w-full flex flex-col">
                <h2 className="font-bold text-2xl mb-2 text-center">
                    Bandeja de Entrada
                </h2>

                <div id="inbox-search" className="flex gap-2 w-full">
                    <div className="flex items-center bg-gray-100 px-2 rounded-md flex-1 min-w-0">
                        <input
                            placeholder="Buscar por asunto, id o descripción..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input bg-gray-100 border-none focus:outline-none shadow-none w-full truncate"
                        />
                        <MagnifyingGlassIcon className="size-5 mr-2 shrink-0" />
                    </div>
                </div>

                <div
                    id="inbox-categories"
                    className="flex my-2 w-full justify-between items-center"
                >
                    <div className="flex gap-2 w-full overflow-x-auto p-1 scrollbar-hide">
                        {categories.map((cat) => (
                            <input
                                key={cat.value}
                                className={`btn rounded-xl border-none py-2 px-4 whitespace-nowrap transition-colors ${
                                    filters.includes(cat.value)
                                        ? "bg-primary text-white hover:bg-primary"
                                        : "bg-gray-100 hover:bg-gray-200"
                                }`}
                                type="checkbox"
                                aria-label={cat.label}
                                checked={filters.includes(cat.value)}
                                onChange={() => toggleFilter(cat.value)}
                            />
                        ))}
                    </div>
                </div>

                <h3
                    id="inbox-date"
                    className="text-start w-full px-2 my-4 font-bold capitalize"
                >
                    {currentMonthYear}
                </h3>
            </div>

            <div
                id="mail-card-scrollarea"
                className="p-2 bg-gray-100 flex-1 overflow-y-auto rounded-md w-full"
            >
                {loading ? (
                    <div className={"flex flex-col gap-2"}>
                        <div className={"skeleton w-full h-40"}></div>
                        <div className={"skeleton w-full h-40"}></div>
                        <div className={"skeleton w-full h-40"}></div>
                    </div>
                ) : (
                    <>
                        {filteredMailCards.length > 0 ? (
                            filteredMailCards.map((card) => (
                                <InboxMailCard key={card.id} card={card} />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center p-10 text-gray-400 text-center">
                                <FunnelIcon className="size-12 mb-2 opacity-20" />
                                <p>No se encontraron PQRS con estos filtros.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

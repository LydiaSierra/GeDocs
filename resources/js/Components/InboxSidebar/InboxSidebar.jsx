import {
    BarsArrowUpIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import InboxMailCard from "@/components/InboxMailCard/InboxMailCard";

export default function InboxSidebar() {

    return (
        <div className="w-full md:min-w-[450px] lg:w-2/3 bg-white flex flex-col rounded-lg h-full md:ml-1 p-3">

            <div className="w-full flex flex-col">
                
             
                <h2 className="font-bold text-2xl mb-3 text-center">
                    Bandeja de Entrada
                </h2>

              
                <div id="inbox-search" className="flex gap-2 w-full mb-2">
                    <div className="flex items-center bg-gray-100 px-3 rounded-md flex-1">
                        <input
                            placeholder="Buscar"
                            type="text"
                            className="input bg-gray-100 border-none focus:outline-none shadow-none w-full"
                        />
                        <MagnifyingGlassIcon className="size-5 ml-2" />
                    </div>

                    <button className="p-3 bg-gray-100 rounded-md shrink-0">
                        <FunnelIcon className="size-5" />
                    </button>
                </div>

                
               
                <div
                    id="inbox-categories"
                    className="hidden md:flex w-full items-center justify-between p-1"
                >
                    <form className="flex gap-2 w-full overflow-x-auto flex-nowrap whitespace-nowrap p-1">
                <input
                    className="btn rounded-xl border-none py-2 px-4 text-black checked:bg-senaGreen checked:text-white"
                    type="checkbox"
                    aria-label="Preguntas"
                />
                <input
                    className="btn rounded-xl border-none py-2 px-4 text-black checked:bg-senaGreen checked:text-white"
                    type="checkbox"
                    aria-label="Quejas"
                />
                <input
                    className="btn rounded-xl border-none py-2 px-4 text-black checked:bg-senaGreen checked:text-white"
                    type="checkbox"
                    aria-label="Reclamos"
                />
                <input
                    className="btn rounded-xl border-none py-2 px-4 text-black checked:bg-senaGreen checked:text-white"
                    type="checkbox"
                    aria-label="Sugerencias"
                />
            </form>


                 
                    <button className="p-3 bg-gray-100 rounded-md ml-2 shrink-0">
                        <BarsArrowUpIcon className="size-5" />
                    </button>
                </div>


             
                <div className="md:hidden w-full mt-3 p-1 flex items-center gap-2">

                    <details className="dropdown w-full">
                        <summary className="btn w-full bg-gray-100">Filtrar por Categorías</summary>

                        <ul className="menu dropdown-content bg-base-100 rounded-box w-full p-2 shadow-md mt-2 z-10">
                            <li>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" /> Preguntas
                                </label>
                            </li>
                            <li>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" /> Quejas
                                </label>
                            </li>
                            <li>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" /> Reclamos
                                </label>
                            </li>
                            <li>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" /> Sugerencias
                                </label>
                            </li>
                        </ul>
                    </details>

                   
                    <button className="p-3 bg-gray-100 rounded-md shrink-0">
                        <BarsArrowUpIcon className="size-5" />
                    </button>
                </div>

              
                <h3 id="inbox-date" className="text-start w-full px-2 my-4 font-bold">
                    Agosto, 2025
                </h3>
            </div>

        
            <div
                id="mail-card-scrollarea"
                className="flex-1 p-2 bg-gray-100 h-64 md:h-80 overflow-y-auto rounded-md w-full"
            >
                <InboxMailCard />
                <InboxMailCard />
                <InboxMailCard />
                <InboxMailCard />
                <InboxMailCard />
            </div>
        </div>
    );
}

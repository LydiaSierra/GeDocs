import {
    BarsArrowUpIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import InboxMailCard from "@/components/InboxMailCard/InboxMailCard";

export default function InboxSidebar() {
    return (
        <div className="w-full md:min-w-[450px] lg:w-1/3 flex-wrap md:flex-nowrap bg-white flex flex-col rounded-lg h-[calc(90vh-70px)] md:h-auto md:ml-1 justify-between items-center md:p-3 ">

            <div className="w-full flex flex-col">
                <h2 className="font-bold text-2xl mb-2 text-center">
                    Bandeja de Entrada
                </h2>


                <div id="inbox-search" className="flex gap-2 w-full">
                    <div className="flex items-center bg-gray-100 px-2 rounded-md flex-1 min-w-0">
                        <input
                            placeholder="Buscar"
                            type="text"
                            className="input bg-gray-100 border-none focus:outline-none shadow-none w-full truncate"
                        />
                        <MagnifyingGlassIcon className="size-5 mr-2 shrink-0" />
                    </div>
                    <button className="p-3 bg-gray-100 rounded-md shrink-0">
                        <FunnelIcon className="size-5" />
                    </button>
                </div>


                <div
                    id="inbox-categories"
                    className="flex my-2 w-full justify-between items-center"
                >
                    <form className="flex gap-2 w-full overflow-x-auto p-1">
                        <input className="btn rounded-xl checked:bg-senaGreen border-none py-2 px-4 whitespace-nowrap" type="checkbox" aria-label="Preguntas" />
                        <input className="btn rounded-xl checked:bg-senaGreen border-none py-2 px-4 whitespace-nowrap" type="checkbox" aria-label="Quejas" />
                        <input className="btn rounded-xl checked:bg-senaGreen border-none py-2 px-4 whitespace-nowrap" type="checkbox" aria-label="Reclamos" />
                        <input className="btn rounded-xl checked:bg-senaGreen border-none py-2 px-4 whitespace-nowrap" type="checkbox" aria-label="Sugerencias" />
                    </form>
                    <button className="p-3 bg-gray-100 rounded-md ml-2 shrink-0">
                        <BarsArrowUpIcon className="size-5" />
                    </button>
                </div>

                <h3 id="inbox-date" className="text-start w-full px-2 my-4 font-bold">
                    Agosto, 2025
                </h3>
            </div>


            <div
                id="mail-card-scrollarea"
                className="p-2 bg-gray-100 flex-1 overflow-y-auto rounded-md w-full"
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



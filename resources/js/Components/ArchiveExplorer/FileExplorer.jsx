import {
    ArrowDownTrayIcon,
    Bars3BottomLeftIcon,
    EllipsisVerticalIcon,
    InformationCircleIcon,
    DocumentIcon,
} from "@heroicons/react/24/solid";


// FileExplorer component to display files in a table format

export default function FileExplorer() {
    return (
        <div className="overflow-x-auto w-full">
            <table className="table border-separate border-spacing-y-2 w-full pb-15">
                <thead className="sticky top-0">
                <tr className="bg-gray-500 rounded-x text-white text-lg z-99">
                    <th className="rounded-l-lg">
                        <label className="h-full">
                            <input type="checkbox" className="checkbox border-white text-white"/>
                        </label>
                    </th>
                    <th>
                        <DocumentIcon className="size-10 opacity-0" />
                    </th>
                    <th className="flex items-center gap-5">
                        <button className=" items-center gap-1">
                            <Bars3BottomLeftIcon className="size-10 fill-white-700 cursor-pointer"></Bars3BottomLeftIcon>
                        </button>
                        Id
                    </th>
                    <th>Nombre</th>
                    <th className="flex items-center gap-5">
                        <button className=" items-center gap-1">
                            <Bars3BottomLeftIcon className="size-10 fill-white-700 cursor-pointer"></Bars3BottomLeftIcon>
                        </button>
                        Fecha de Carga
                    </th>
                    <th>Tamaño del Archivo</th>
                    <th >Tipo</th>
                    <th className="rounded-r-lg"></th>
                </tr>
                </thead>

            </table>
            <div className="drawer drawer-end">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    {/* Page content here */}
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 text-base-content absolute top-25 h-200 w-110 p-4 rounded-md overflow-y-scroll">
                        {/* Sidebar content here */}
                        <div className="">

                        </div>
                    </ul>

                </div>
            </div>
        </div>
    )
}
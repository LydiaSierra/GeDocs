// OptionsButtons contains reusable button components for common actions (delete, edit, download, details) used throughout the archive explorer UI.
import { useExplorerData } from "@/Hooks/useExplorer"
import { ArrowDownTrayIcon, InformationCircleIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline"
import { toast } from "sonner"




export const DeleteButtonOption = ({ showText = true }) => {
    return (
        <li className={`${showText ? "" : "tooltip tooltip-bottom"}`} data-tip="Mover a la papelera">
            <button className={`cursor-pointer border border-red-200 bg-red-500/5 text-red-600 transition-colors duration-300 ${showText ? "flex w-full items-center gap-2 p-3 rounded-md" : "inline-block p-1  rounded-full "}`} onClick={() => document.getElementById('confirmDeleteFolder').showModal()}>
                <TrashIcon className="size-5" />
                {showText && "Mover a la papelera"}
            </button>
        </li>
    )
}
export const EditButtonOption = ({ showText = true }) => {
    const { selectedItems, setSelectedItems, folders } = useExplorerData()

    return (
        <li className={`${showText ? "" : "tooltip tooltip-bottom"}`} data-tip="Mover a la papelera">
            <button
                onClick={() => {
                    if (selectedItems.length !== 1) {
                        toast.warning('Selecciona solo una carpeta para editar');
                        return;
                    }

                    document.getElementById('createFolder').showModal();
                }
                }
                className={`${selectedItems?.length !== 1 ? "opacity-50 pointer-events-none" : "opacity-100 active:bg-red-300"} ${showText ? "flex w-full items-center gap-2 p-3 border-b border-base-300 rounded-md" : "inline-block p-1  rounded-full "} hover:bg-base-300 transition-colors cursor-pointer`}
            >
                <PencilSquareIcon className="w-5 h-5 text-gray-600" />
                {showText && "Editar"}
            </button>
        </li>
    )
}


export const DetailsButtonOption = ({ showText = true }) => {
    const { selectedItems, folders, setSelectedItem } = useExplorerData();
    return (
        <li className={`${showText ? "" : "tooltip tooltip-bottom"}`} data-tip="Mover a la papelera">
            <button
                onClick={() => {
                    document.getElementById('modalDetails').showModal()

                    if (selectedItems.length > 1) {
                        toast.warning('Selecciona solo una carpeta para ver los detalles');
                        return;
                    }
                }
                }
                className={`${selectedItems.length > 1 ? "opacity-50 pointer-events-none" : "opacity-100 active:bg-base-300"} cursor-pointer  transition-colors duration-300  hover:bg-base-300 ${showText ? "flex w-full items-center gap-2 px-3 py-2 rounded-md" : "inline-block p-1  rounded-full  cursor-pointer"}`}
            >
                <InformationCircleIcon className="w-5 h-5 text-gray-600" />
                {showText &&
                    <span>Detalles</span>
                }
            </button>
        </li>
    )
}

export const DownloadButtonOption = ({ showText = true }) => {
    const { downloadZip } = useExplorerData();
    return (
        <div className={`${showText ? "" : "tooltip tooltip-bottom"} flex items-center`} data-tip="Descargar">
            <button className={`${showText ? "flex items-center p-3 rounded-md border-b  border-base-300" : "rounded-full p-1 "} hover:bg-base-300  cursor-pointer transition-colors w-full gap-3`} onClick={async () => {

                try {
                    const idToast = toast.loading("Preparando Descarga");
                    await downloadZip();
                    toast.dismiss(idToast)
                } catch (err) {
                    toast.error("Error al decargar " + err?.message);
                } finally {
                }
            }}>
                <ArrowDownTrayIcon className='size-5' />
                {showText && "Descargar"
                }
            </button>
        </div>

    )
}
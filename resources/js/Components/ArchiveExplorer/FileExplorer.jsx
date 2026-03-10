// FileExplorer is responsible for rendering the list or grid of files within the current folder. It manages file selection, preview, and file-specific actions in the explorer.
import {
    DocumentIcon,
    PhotoIcon,
} from "@heroicons/react/24/solid";
import { useExplorerData, useExplorerUI } from "@/Hooks/useExplorer";
import MenuOptions from "./MenuOptions";
import ButtonDrawerInformation from "./Modals/ButtonDrawerInformation";

const File = ({ file }) => {
    const { gridView } = useExplorerUI();
    const { selectItem, selectedItems, isMultipleSelection, isSelected } = useExplorerData();

    const open = () => {
        window.open(file.url, "_blank");
    };

    return (
        <>
            {gridView ? (
                /** GRID VIEW **/
                <div
                    key={file.id}
                    onClick={(e) => selectItem(file.id, 'file', e)}
                    className={`cursor-pointer relative border-b lg:border rounded-lg shadow-sm hover:shadow-md transition p-2 text-center select-none items-center justify-between ${isSelected(file.id, 'file') ? "bg-primary/30" : "bg-white hover:bg-primary/20"}`}
                    onDoubleClick={open}
                >
                    {(isMultipleSelection && selectedItems.length > 0) &&
                        <input type="checkbox" name="selected" id="selected" className="checkbox checkbox-primary absolute left-2 top-2" checked={isSelected(file.id, 'file')} />
                    }
                    {/* ICON + NAME */}
                    <div className="flex flex-col items-center gap-3 w-full select-none">

                        {file.is_image ? (
                            <PhotoIcon className="w-8 text-blue-500" />
                        ) : file.is_pdf ? (
                            <div className="w-12 h-14">
                                <iframe src={file.url} frameBorder="0" className="w-full h-full object-cover"></iframe>
                            </div>
                        ) : (
                            <DocumentIcon className="w-8 text-gray-800" />
                        )}

                        <p className="font-medium w-full truncate text-gray-700 hover:underline">
                            {file.name}
                        </p>
                    </div>

                    {/* OPTIONS BUTTON */}
                    <div className={`${gridView ? "absolute top-2 right-2" : "relative"}`}>
                        <>
                            <div className="hidden md:inline-block">
                                <MenuOptions />
                            </div>
                            <div className="md:hidden">
                                <ButtonDrawerInformation />
                            </div>
                        </>
                    </div>

                </div>
            ) : (
                /** LIST VIEW **/
                <div className="flex flex-col">
                    <div
                        key={file.id}
                        onClick={(e) => selectItem(file.id, 'file', e)}

                        className={`flex justify-between border-b border-gray-400 px-2 py-3 cursor-pointer select-none ${isSelected(file.id, "file") ? "bg-primary/30" : "bg-white hover:bg-primary/20"} `}
                    >


                        <div className={`flex ${gridView ? "flex-col" : " gap-2 items-center font-medium min-w-0 w-full"}`}>
                            {(isMultipleSelection && selectedItems.length > 0) &&
                                <input type="checkbox" name="selected" id="selected" className="checkbox checkbox-primary" checked={isSelected(file.id, "file")} />
                            }
                            {file.is_image ? (
                                <PhotoIcon className="w-8 text-blue-500" />
                            ) : file.is_pdf ? (
                                <div className="w-12 h-14">
                                    <iframe src={file.url} frameBorder="0" className="w-full h-full object-cover"></iframe>
                                </div>
                            ) : (
                                <DocumentIcon className="w-8 text-gray-800" />
                            )}

                            <span className="text-gray-600 shrink-0">{file.file_code}</span>
                            <span className="shrink-0">-</span>
                            <div className="flex flex-col md:flex-row max-w-1/2 md:max-w-full">
                                <span className="truncate w-full">{file.name}</span>
                                <p className="w-26 md:hidden text-xs text-gray-500">--</p>
                            </div>
                        </div>

                        <div className="flex gap-5 items-center">
                            <p className="w-26 hidden md:inline-block text-gray-500">--</p>
                            <p>{new Date(file.created_at).toLocaleDateString()}</p>
                            {!isMultipleSelection &&
                                <>
                                    <div className="hidden md:inline-block">
                                        <MenuOptions />
                                    </div>
                                    <div className="md:hidden">
                                        <ButtonDrawerInformation />
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>
            )}
        </>


        // <li><a href={file.url} download={file.name}>Descargar</a></li>
    );
};

export default File;

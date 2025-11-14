import {useContext} from "react";
import {
    ArrowDownTrayIcon,
    EllipsisVerticalIcon,
    FolderIcon,
    InformationCircleIcon,
} from "@heroicons/react/24/solid";


import {ArchiveUIContext} from "@/context/ArchiveUIContext";
import {ArchiveDataContext} from "@/context/ArchiveDataContext";


export const FolderRow = ({folder}) => {

    // Contexts for UI and data management

    const {navigateToFolder} = useContext(ArchiveDataContext);

    return (


            <tr
                key={folder.id}
                className="odd:bg-gray-100 hover:bg-[#A7F1FB] even:bg-gray-200 text-black cursor-pointer"
                onDoubleClick={() => navigateToFolder(folder.id, folder.name)}
            >
                <td className="rounded-l-lg p-2">
                    <input
                        type="checkbox"
                        className="checkbox"
                        onDoubleClick={(e) => e.stopPropagation()}
                    />
                </td>
                <td>
                    <FolderIcon className="size-10 text-gray-700 cursor-pointer"/>
                </td>
                <td>{folder.document_code ?? "--"}</td>
                <td>{folder.name}</td>
                <td>{new Date(folder.updated_at).toLocaleDateString()}</td>
                <td>--</td>
                <td>{folder.type || "Carpeta"}</td>
                <td className="flex justify-center gap-3 rounded-r-lg">
                    <div className="border-none bg-transparent rounded-full hover:bg-[#75D0D1]">
                        <ArrowDownTrayIcon className="size-7 m-1 text-gray-700"/>
                    </div>
                </td>
            </tr>


    );
};

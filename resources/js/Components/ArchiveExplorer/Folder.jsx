

import { useContext } from "react";
import {
  ArrowDownTrayIcon,
  EllipsisVerticalIcon,
  FolderIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";


import { ArchiveUIContext } from "@/context/ArchiveUIContext";
import { ArchiveDataContext } from "@/context/ArchiveDataContext";



export const Folder = ({ folder }) => {

  // Contexts for UI and data management

  const { gridView, handleModalDetails } = useContext(ArchiveUIContext);
  const { navigateToFolder } = useContext(ArchiveDataContext);

  return (
    <>
      {gridView ? (
        // Grid view
        <div
          key={folder.id}
          onDoubleClick={() => navigateToFolder(folder.id, folder.name)}
          className="cursor-pointer border rounded-lg shadow-sm bg-white hover:shadow-md relative hover:bg-[#E8F9FB] transition p-4 flex flex-col items-center text-center select-none"
        >
          <FolderIcon className="w-12 h-12 text-gray-500 mb-2" />
          <p className="font-medium truncate w-full text-gray-700">{folder.name}</p>

          {/* Button of options*/}
          <div className="dropdown dropdown-end absolute top-2 right-2">
            <div
              tabIndex={0}
              role="button"
              className="z-1 border-none bg-transparent rounded-full hover:bg-[#75D0D1]"
            >
              <EllipsisVerticalIcon className="size-8 fill-gray-700" />
            </div>
            <ul className="dropdown-content menu bg-base-100 rounded-box w-40 p-2 shadow-sm">
              <li>
                <button
                  type="button"
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => handleModalDetails("folder", folder)}
                >
                  <InformationCircleIcon className="size-4 fill-gray-700" />
                  Detalles
                </button>
              </li>
              <li>
                <a>
                  <ArrowDownTrayIcon className="size-4 fill-gray-700" />
                  Descargar
                </a>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        // Table view
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
            <FolderIcon className="size-10 text-gray-700 cursor-pointer" />
          </td>
          <td>{folder.document_code ?? "--"}</td>
          <td>{folder.name}</td>
          <td>{new Date(folder.updated_at).toLocaleDateString()}</td>
          <td>--</td>
          <td>{folder.type || "Carpeta"}</td>
          <td className="flex justify-center gap-3 rounded-r-lg">
            <div className="border-none bg-transparent rounded-full hover:bg-[#75D0D1]">
              <ArrowDownTrayIcon className="size-7 m-1 text-gray-700" />
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

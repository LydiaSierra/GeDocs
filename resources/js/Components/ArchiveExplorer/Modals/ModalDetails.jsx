import { useContext } from "react";
import { DocumentIcon, FolderIcon } from "@heroicons/react/24/outline";
import { ArchiveUIContext } from "@/context/ArchiveExplorer/ArchiveUIContext";
import { ArchiveDataContext } from "@/context/ArchiveExplorer/ArchiveDataContext";

export const ModalDetails = () => {

  // Context UI management
  const { selectedItem, setSelectedItem, formatSize } = useContext(ArchiveUIContext);
  const { currentFolder } = useContext(ArchiveDataContext);


  if (!selectedItem) return null;
  // Destructure selectedItem and data from the selected item


  // Render the modal with item details
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-40 text-xl"
      onClick={() => {
        setSelectedItem(null);
      }}
    >
      <div
        className="max-w-xs md:max-w-md w-full  bg-white border rounded-lg shadow-sm p-4 text-center transform origin-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Icon */}
        <div className="w-full flex justify-center mb-2">
          <div className="border rounded-md p-6">
            {selectedItem?.extension ? (
              <DocumentIcon className="w-12 h-12 text-gray-600" />
            ) : (
              <FolderIcon className="w-12 h-12 text-gray-600" />
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="font-semibold text-gray-900 mb-3 w-full truncate">
          {selectedItem?.name || "Detalles"}
        </h2>

        {/* General data  */}
        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <span className="font-medium">Tipo:</span>{" "}
            {selectedItem?.extension ? `Archivo ${selectedItem?.extension}` : "Carpeta"}
          </p>
          <p>
            <span className="font-medium">Última Modificación: {new Date(selectedItem?.updated_at || selectedItem?.created_at).toLocaleString()}</span>

          </p>
        </div>

        <hr className="my-3" />

        {/* Extra Data */}
        <div className="text-sm text-gray-700 space-y-1 text-left">
          <p>
            <span className="font-medium">Código sección:</span>{" "}
            {currentFolder?.folder_code || selectedItem?.folder_code || "--"}
          </p>
          <p>
            <span className="font-medium">Dentro de:</span> {currentFolder?.name ?? "--"}
          </p>
          <p>
            <span className="font-medium">Clasificación:</span>{" "}
            {currentFolder?.departament || selectedItem?.departament || "--"}
          </p>
          {selectedItem?.extemsion &&
            <>
              <p>
                <span className="font-medium">Tamaño:</span>{" "}
                {selectedItem === "folder" ? "--" : formatSize(selectedItem?.size)}
              </p>
            </>
          }
        </div>
      </div>
    </div>
  );
};

import { useContext } from "react";
import { DocumentIcon, FolderIcon } from "@heroicons/react/24/outline";
import { ArchiveUIContext } from "@/context/ArchiveExplorer/ArchiveUIContext";

export const ModalDetails = () => {

  // Context UI management
  const { selectedItem, handleModalDetails, formatSize } = useContext(ArchiveUIContext);


  if (!selectedItem) return null;
    // Destructure type and data from the selected item
  const { type, data } = selectedItem;

  // Render the modal with item details
  return (
    <div
      className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-40 text-xl"
      onClick={handleModalDetails}
    >
      <div
        className="max-w-xs md:max-w-md w-full  bg-white border rounded-lg shadow-sm p-4 text-center transform origin-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Icon */}
        <div className="w-full flex justify-center mb-2">
          <div className="border rounded-md p-6">
            {type === "folder" ? (
              <FolderIcon className="w-12 h-12 text-gray-600" />
            ) : (
              <DocumentIcon className="w-12 h-12 text-gray-600" />
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="font-semibold text-gray-900 mb-3">
          {data?.name || "Detalles"}
        </h2>

        {/* General data  */}
        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <span className="font-medium">Tipo:</span>{" "}
            {type === "folder" ? "Carpeta" : data?.tipo || "Archivo"}
          </p>
          <p>
            <span className="font-medium">Última Modificación:</span>{" "}
            {(() => {
              const d = data?.updated_at || data?.created_at;
              return d ? new Date(d).toLocaleDateString() : "--";
            })()}
          </p>
          <p>
            <span className="font-medium">Abierto 2025 por:</span>{" "}
            {data?.opened_by || "js@gmail.com"}
          </p>
          <p>
            <span className="font-medium">Abierto:</span>{" "}
            {data?.opened_at
              ? new Date(data.opened_at).toLocaleDateString()
              : "26 Agosto 2025"}
          </p>
        </div>

        <hr className="my-3" />

        {/* Extra Data */}
        <div className="text-sm text-gray-700 space-y-1 text-left">
          <p>
            <span className="font-medium">Código sección:</span>{" "}
            {data?.codigo_documental ?? "--"}
          </p>
          <p>
            <span className="font-medium">Series:</span> {data?.series ?? "--"}
          </p>
          <p>
            <span className="font-medium">Subseries:</span>{" "}
            {data?.subseries ?? "--"}
          </p>
          <p>
            <span className="font-medium">Tamaño:</span>{" "}
            {type === "folder" ? "--" : formatSize(data?.size)}
          </p>
        </div>
      </div>
    </div>
  );
};
